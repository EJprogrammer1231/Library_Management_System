const STORAGE_KEY = "scas-user-profile";
const STUDENTS_STORAGE_KEY = "scas-student-accounts";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function canUseApi() {
  return Boolean(API_BASE_URL);
}

async function fetchJson(path, options = {}) {
  if (!canUseApi()) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

function saveRemoteStudents(students) {
  if (!canUseApi()) {
    return;
  }

  fetchJson("/api/students-state", {
    method: "POST",
    body: JSON.stringify(students),
  }).catch(() => {});
}

export async function syncRemoteStudents() {
  const remoteStudents = await fetchJson("/api/students");
  if (Array.isArray(remoteStudents)) {
    window.localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(remoteStudents));
    dispatchUpdate("scas-student-accounts-updated");
  }
}

/**
 * Fire a synthetic storage notification for tabs on the same origin.
 * This keeps student and admin frontends synced when they share localStorage.
 */
function notifyStorageSync() {
  if (!canUseStorage()) {
    return;
  }

  const key = "__scas_storage_sync__";
  const value = Date.now().toString();

  window.localStorage.setItem(key, value);
  window.localStorage.removeItem(key);
}

function dispatchUpdate(eventName) {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new Event(eventName));
  notifyStorageSync();
}

export function getStoredProfile() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  if (!canUseStorage()) {
    return;
  }

  const nextProfile = {
    ...profile,
    id: profile.id || createStudentId(profile),
    joinedAt: profile.joinedAt || new Date().toISOString(),
    status: profile.status || "Active",
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
  saveStudentAccount(nextProfile);

  dispatchUpdate("scas-user-profile-updated");
  saveRemoteStudents(getStoredStudents());
}

export function getStoredStudents() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      const profile = getStoredProfile();
      return profile ? [normalizeStudent(profile)] : [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeStudent);
  } catch {
    return [];
  }
}

export function deleteStudentAccount(studentId) {
  if (!canUseStorage()) {
    return [];
  }

  const nextStudents = getStoredStudents().filter((student) => student.id !== studentId);
  const currentProfile = getStoredProfile();

  window.localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(nextStudents));

  if (currentProfile?.id === studentId) {
    window.localStorage.removeItem(STORAGE_KEY);
    dispatchUpdate("scas-user-profile-updated");
  }

  dispatchUpdate("scas-student-accounts-updated");
  saveRemoteStudents(nextStudents);
  return nextStudents;
}

function saveStudentAccount(profile) {
  const students = getStoredStudents();
  const nextStudent = normalizeStudent(profile);
  const existingIndex = students.findIndex(
    (student) => student.email && student.email === nextStudent.email,
  );
  const nextStudents =
    existingIndex >= 0
      ? students.map((student, index) =>
          index === existingIndex ? { ...student, ...nextStudent } : student,
        )
      : [nextStudent, ...students];

  window.localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(nextStudents));
  dispatchUpdate("scas-student-accounts-updated");
  saveRemoteStudents(nextStudents);
}

function normalizeStudent(student) {
  return {
    id: student.id || createStudentId(student),
    fullName: student.fullName || student.name || "Student",
    email: student.email || "No email",
    course: student.course || "Not specified",
    yearLevel: student.yearLevel || "Not specified",
    section: student.section || "Not specified",
    avatar: student.avatar || "",
    status: student.status || "Active",
    joinedAt: student.joinedAt || new Date().toISOString(),
  };
}

function createStudentId(student) {
  return `${student.email || student.fullName || "student"}-${Date.now()}`;
}

const STORAGE_KEY = "scas-user-profile";
const STUDENTS_STORAGE_KEY = "scas-student-accounts";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
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

  window.dispatchEvent(new Event("scas-user-profile-updated"));
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
    window.dispatchEvent(new Event("scas-user-profile-updated"));
  }

  window.dispatchEvent(new Event("scas-student-accounts-updated"));
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
  window.dispatchEvent(new Event("scas-student-accounts-updated"));
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

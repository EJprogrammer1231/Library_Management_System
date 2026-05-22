const mongoose = require("mongoose");

const StudentAccountSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    fullName: { type: String, default: "Student" },
    email: { type: String, default: "No email", index: { unique: false } },
    course: { type: String, default: "Not specified" },
    yearLevel: { type: String, default: "Not specified" },
    section: { type: String, default: "Not specified" },
    avatar: { type: String, default: "" },
    status: { type: String, default: "Active" },
    joinedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false }
);

module.exports = mongoose.model("StudentAccount", StudentAccountSchema);


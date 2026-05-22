const mongoose = require("mongoose");

const BorrowReserveReportSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    bookId: { type: Number },
    bookTitle: { type: String, default: "" },
    bookAuthor: { type: String, default: "" },
    studentName: { type: String, default: "Unknown Student" },
    studentCourse: { type: String, default: "Not specified" },
    status: {
      type: String,
      enum: ["Borrowed", "Reserved"],
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
    date: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false }
);

BorrowReserveReportSchema.index({ date: -1 });

module.exports = mongoose.model(
  "BorrowReserveReport",
  BorrowReserveReportSchema,
);


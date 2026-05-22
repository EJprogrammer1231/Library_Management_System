const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Available", "Borrowed", "Reserved", "Not Available"],
      default: "Available",
    },
    category: { type: String, default: "General", index: true },
    copies: { type: Number, default: 1, min: 0 },
    borrowedCopies: { type: Number, default: 0, min: 0 },
    reservedCopies: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    // Keep compatibility with existing frontend model shape
    id: { type: Number },
  },
  { timestamps: true }
);

BookSchema.index({ title: 1, author: 1 });

module.exports = mongoose.model("Book", BookSchema);


const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["user", "store", "office"],
    default: "user",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Membuat index agar bisa melakukan query spasial
locationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Location", locationSchema);

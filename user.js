const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  Email: { type: String, unique: true },
  CreatedAt: Date,
  UpdatedAt: Date,
  address: {
    street: String,
    City: String,
  },
});

module.exports = mongoose.model("testcol1", userSchema);

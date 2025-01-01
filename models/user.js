import mongoose from "mongoose";
const { Schema, ObjectId, model } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  address: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  password: {
    type: String,
    min: 6,
    max: 64,
    required: true,
  },
  role: {
    type: [String],
    default: ["Buyer"],
    enum: ["Buyer", "Seller", "Admin"],
  },
  photo: {},
  logo: {},
  company: {
    type: String,
    default: "",
  },
  enquiredProperties: [{ type: ObjectId, ref: "Ad" }],
  wishlist: [{ type: ObjectId, ref: "Ad" }],
  about: {
    type: String,
    default: "",
  },
});

export default model("User", userSchema);

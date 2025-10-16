import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  userName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  connectCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
});

export default mongoose.model("User", userSchema);

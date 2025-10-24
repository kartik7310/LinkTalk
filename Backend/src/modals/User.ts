import mongoose, { Document, Schema } from "mongoose";

// 1️⃣ Define a TypeScript interface for your User
export interface IUser extends Document {
  id:string;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  connectCode: string;
}

// 2️⃣ Define your schema
const userSchema = new Schema<IUser>({
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

// 3️⃣ Export both the model and the interface
const User = mongoose.model<IUser>("User", userSchema);
export default User;

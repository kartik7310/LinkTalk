
  import User from "../modals/User.js";
  import { CustomError } from "../utils/CustomError.js";
  import bcrypt from "bcryptjs";
  import { LoginInput, RegisterInput } from "../Schemas/Auth.js";
import generateUniqueConnectCode from "../utils/generateUniqueConnectCode.js";
  export const AuthService = {
    registerUser: async (data:RegisterInput) => {
      try {
        const { email, password, confirmPassword, userName, fullName } = data;

        if (password !== confirmPassword) {
          throw new CustomError("Passwords do not match", 400);
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new CustomError("User already exists", 400);
        }

    
        const hashedPassword = await bcrypt.hash(password, 10);
        const connectUniqueCode = await generateUniqueConnectCode()
        
        const user = await User.create({
          fullName,
          userName,
          email,
          password: hashedPassword,
          connectCode:connectUniqueCode
        });
    const userObj = user.toObject();
      const { password: _password, ...userData } = userObj;


      return userData;


      } catch (error) {
        throw error; 
      }
    },

    loginUser: async (data: LoginInput) => {
    const { email, password } = data;

    const user = await User.findOne({ email })
    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("pass",isPasswordValid);
    
    if (!isPasswordValid) {
      throw new CustomError("Invalid email or password", 401);
    }

           const userObj = user.toObject();
      const { password: _password, ...userData } = userObj;
      return userData
  },

    getUserById: async (userId: string) => {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      const userObj = user.toObject();
      const { password: _password, ...userData } = userObj;

      return userData;
    }
  }


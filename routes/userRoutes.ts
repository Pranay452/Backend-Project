import express, { Router } from "express";
import {
  googleSignin,
  resetPassword,
  sendOtp,
  signinUser,
  signupUser,
  updateUser,
  verifyOtp,
  verifyResetPasswordOtp,
} from "../controllers/userController";

import { verifyToken } from "../utils/verifyUser";
import { userValidation } from "../validators/userValidator";

export const userRouter: Router = express.Router();
const { signUp, signIn } = userValidation || {};

userRouter.post("/signUp", signUp, signupUser);
userRouter.post("/signIn", signIn, signinUser);
userRouter.post("/auth/google", googleSignin);
userRouter.post("/verifyotp", verifyOtp);
userRouter.put("/user/update/:userId", verifyToken, updateUser);
userRouter.post("/user/resetPassword", resetPassword);
userRouter.post("/user/sendOtp", sendOtp);
userRouter.post("/user/verifyResetPasswordOtp", verifyResetPasswordOtp);

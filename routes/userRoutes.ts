import express, { Router } from "express";
import {
  googleSignin,
  signinUser,
  signupUser,
  updateUser,
} from "../controllers/userController";

import { userValidation } from "../validators/userValidator";
import { verifyToken } from "../utils/verifyUser";

export const userRouter: Router = express.Router();
const { signUp, signIn } = userValidation || {};

userRouter.post("/signUp", signUp, signupUser);
userRouter.post("/signIn", signIn, signinUser);
userRouter.post("/auth/google", googleSignin);
userRouter.put("/user/update/:userId", verifyToken, updateUser);

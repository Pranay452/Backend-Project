import express, { Router } from "express";
import { signupUser, signinUser } from "../controllers/userController";
import { userValidation } from "../validators/userValidator";

export const userRouter: Router = express.Router();
const { signUp, signIn } = userValidation || {};

userRouter.post("/signUp", signUp, signupUser);
userRouter.post("/signIn", signIn, signinUser);

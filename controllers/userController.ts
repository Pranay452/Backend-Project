import { Request, Response } from "express";
import User from "../models/userModel";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import generateToken from "../utils/jwtToken";

export const signupUser = async (req: Request, res: Response) => {
  const { username, email, password, contact_number } = req.body || {};
  if (!username || !email || !password || !contact_number) {
    return res.status(400).send({ message: "All fileds are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    //checking for existing user
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const encryptPassword = await hashPassword(password);
    const newUser = { username, email, contact_number };
    // Create a new user
    const newUsers = new User({
      username: newUser.username,
      email: newUser.email,
      password: encryptPassword,
      contact_number,
    });

    // Save the user to the database
    await newUsers.save();
    res.status(201).send({ data: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "Failed to create user" });
  }
};

export const signinUser = async (req: Request, res: Response) => {
  // Implement user login logic here
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const isPasswordMatch = comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = generateToken({
      id: user._id,
      email: user.email,
    });
    res.status(200).send({ accessToken: token });
    // const refreshToken = generateRefreshToken(user._id);
    // await User.findByIdAndUpdate(user._id, {
    //   refreshToken,
    //   refreshTokenExp: getRefreshTokenExpiration(),
    // });
    // res.status(200).send({ accesstoken: token, refreshToken: refreshToken });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).send({ message: "login failed" });
  }
};

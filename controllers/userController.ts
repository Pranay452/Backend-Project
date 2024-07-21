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
    // Create a new user
    const newUsers = new User({
      username: username,
      email: email,
      password: encryptPassword,
      contact_number,
    });

    const newUser = {
      username,
      email,
      contact_number,
      _id: newUsers._id,
    };

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
    const currentUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      contact_number: user.contact_number,
      accessToken: token,
    };
    res
      .status(200)
      .send({ accessToken: token, user: currentUser, status: "SUCCESS" });
    // const refreshToken = generateRefreshToken(user._id);
    // await User.findByIdAndUpdate(user._id, {
    //   refreshToken,
    //   refreshTokenExp: getRefreshTokenExpiration(),
    // });
    // res.status(200).send({ accesstoken: token, refreshToken: refreshToken });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).send({ message: "login failed", status: "FAILED" });
  }
};

export const googleSignin = async (req: Request, res: Response) => {
  const { email, username } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = generateToken({ id: user._id, email });
      // @ts-ignore
      const { password, ...rest } = user?._doc;
      res.status(200).json({
        status: "SUCCESS",
        accessToken: token,
        user: rest,
      });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const encryptPassword = await hashPassword(generatePassword);
      const newUser = new User({
        username,
        email,
        password: encryptPassword,
      });
      await newUser.save();
      const token = generateToken({ id: newUser._id, email });
      // @ts-ignore
      const { password, ...rest } = newUser?._doc;
      res.status(200).json({
        status: "SUCCESS",
        accessToken: token,
        user: rest,
      });
    }
  } catch (error) {
    console.log("Login error:", error);
    res
      .status(500)
      .send({ message: "Authentication failed", status: "FAILED" });
  }
};

export const updateUser = async (req: any, res: any) => {
  const { user, params, body } = req || {};
  const { id } = user || {};
  const { userId } = params || {};
  const { username, password, email, contact_number } = body || {};
  let updatedPassword: string | undefined = undefined;

  if (id !== userId) {
    res
      .status(403)
      .send({ message: "You are not allowed to update this user" });
    return;
  }
  if (password !== undefined) {
    if (password.length < 6) {
      res
        .status(400)
        .send({ message: "Password must be at least 6 characters long" });
    }
    updatedPassword = await hashPassword(password);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username,
          password: updatedPassword,
          email,
          contact_number,
        },
      },
      { new: true }
    );
    // @ts-ignore
    const { password, ...rest } = updatedUser?._doc;
    res.status(200).json({
      status: "SUCCESS",
      data: rest,
    });
  } catch (error) {
    console.log("Login error:", error);
    res
      .status(500)
      .send({ message: "Authentication failed", status: "FAILED" });
  }
};

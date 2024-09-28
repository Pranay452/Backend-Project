import { Request, Response } from "express";
import User from "../models/userModel";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import generateToken from "../utils/jwtToken";
import nodemailer from "nodemailer";
import orders from "razorpay/dist/types/orders";
import Order from "../models/orderModel";

const otpStore = new Map<string, { otp: string; userDetails?: any }>();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pramodhiniarts@gmail.com",
      pass: "zeim fssd htkv fkui",
    },
  });

  const mailOptions = {
    from: "pramodhiniarts@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const signupUser = async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    contact_number,
    isAdmin = false,
  } = req.body; // Added isAdmin
  if (!username || !email || !password || !contact_number) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ status: "FAILED", message: "User already exists" });
    }

    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      userDetails: { username, email, password, contact_number, isAdmin }, // Added isAdmin to userDetails
    });

    await sendEmail(email, otp);
    res.status(200).send({ status: "SUCCESS", message: "OTP sent to email" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ status: "FAILED", message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res
      .status(400)
      .send({ status: "FAILED", message: "Invalid OTP or email" });
  }

  if (Number(storedData.otp) !== Number(otp)) {
    return res.status(400).send({ status: "FAILED", message: "Invalid OTP" });
  }

  try {
    const { username, password, contact_number, isAdmin } =
      storedData.userDetails;

    const isCheckAdmin = storedData?.userDetails?.isAdmin;

    const encryptedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
      contact_number,
      isCheckAdmin,
    });

    await newUser.save();
    otpStore.delete(email);
    res
      .status(201)
      .send({ status: "SUCCESS", message: "User registered successfully" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res
      .status(500)
      .send({ status: "FAILED", message: "Failed to register user" });
  }
};

export const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "FAILED", message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ status: "FAILED", message: "User not found" });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: "FAILED", message: "Invalid Password" });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      username: user.username,
      contactnumber: user.contact_number,
      isAdmin: user.isAdmin,
    });

    const currentUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      contact_number: user.contact_number,
      isAdmin: user.isAdmin,
      accessToken: token,
    };

    res
      .status(200)
      .send({ accessToken: token, user: currentUser, status: "SUCCESS" });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).send({ message: "Login failed", status: "FAILED" });
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
    res.status(403).send({
      status: "FAILED",
      message: "You are not allowed to update this user",
    });
    return;
  }
  if (password !== undefined) {
    if (password.length < 6) {
      res.status(400).send({
        status: "FAILED",
        message: "Password must be at least 6 characters long",
      });
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

export const sendOtp = async (req: Request, res: Response) => {
  const { email, isResend } = req.body;

  if (!email) {
    return res
      .status(400)
      .send({ status: "FAILED", message: "Email is required" });
  }

  try {
    if (!isResend) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ message: "User not found" });
      }
    }

    const otp = generateOTP();
    otpStore.set(email, { otp, userDetails: { email } });

    await sendEmail(email, otp);
    res.status(200).send({ status: "SUCCESS", message: "OTP sent to email" });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).send({ status: "FAILED", message: "Failed to send OTP" });
  }
};

export const verifyResetPasswordOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .send({ status: "FAILED", message: "All fields are required" });
  }

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).send({ status: "FAILED", message: "Invalid Email" });
  }

  if (storedData.otp !== otp) {
    return res.status(400).send({ message: "Invalid OTP" });
  }

  try {
    otpStore.delete(email);
    res
      .status(200)
      .send({ status: "SUCCESS", message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).send({ status: "FAILED", message: "Failed to verify OTP" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .send({ status: "FAILED", message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .send({ status: "FAILED", message: "Passwords do not match" });
  }

  try {
    const encryptedPassword = await hashPassword(newPassword);

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: encryptedPassword } },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ status: "FAILED", message: "User not found" });
    }

    res
      .status(200)
      .send({ status: "SUCCESS", message: "Password reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res
      .status(500)
      .send({ status: "FAILED", message: "Failed to reset password" });
  }
};

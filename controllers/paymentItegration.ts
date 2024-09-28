import { Request, Response } from "express";
import { getRazorpayInstance } from "../utils/PaymentHelper";
import crypto from "crypto";
import Payment from "../models/paymentModel";
import nodemailer from "nodemailer";

const sendEmail = async (email: string, amount: any) => {
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
    subject: "🎉 Order & Payment Success! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #4CAF50; font-size: 28px;">🎉 Super Exciting News! 🎉</h1>
        <p style="font-size: 18px; color: #333;">
          Your order has been <strong>successfully placed</strong>, and we are thrilled to inform you that 
          your payment has been <strong>successfully processed of  ₹${amount}</strong>! 🛒💸
        </p>
        
        <!-- Updated animated happy success GIF -->
        <img src="https://media.giphy.com/media/l0HlSNOxJB956qwfK/giphy.gif" 
             alt="Super Happy Success" style="width: 100%; max-width: 400px; border-radius: 10px;" />

        <p style="font-size: 16px; color: #555; margin-top: 20px;">
          Thank you for shopping with <strong>Pramodhini Arts</strong>! <br /> 
          We can’t wait for you to enjoy your order! 😍
        </p>

        <hr style="border: none; height: 1px; background-color: #eee; margin: 20px 0;" />

        <p style="font-size: 14px; color: #777;">
          If you have any questions, feel free to reply to this email. <br />
          We are here to assist you anytime!
        </p>

        <p style="font-size: 14px; color: #777;">Best Regards,<br/> 
          <strong>Pramodhini Arts Team</strong></p>
      </div>
    `,
  };

  // Email to pramodhiniarts@gmail.com (internal notification)
  const internalMailOptions = {
    from: "pramodhiniarts@gmail.com",
    to: "pramodhiniarts@gmail.com", // Emailing to yourself
    subject: "New Order and Payment Received",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #4CAF50; font-size: 24px;">New Order Alert</h1>
        <p style="font-size: 16px; color: #333;">
          A new order has been placed and a payment of ₹${amount} has been received. <br />
          Customer Email: ${email}
        </p>
        <hr style="border: none; height: 1px; background-color: #eee; margin: 20px 0;" />
        <p style="font-size: 14px; color: #777;">This is an automatic notification.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  await transporter.sendMail(internalMailOptions);
};

export const generateOrderId = async (req: Request, res: Response) => {
  const { amount } = req.body || {};

  if (!amount) {
    res.status(400).send({ message: "Amount not found" });
  }

  var options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  const razorpayInstance = getRazorpayInstance();

  razorpayInstance.orders.create(options, function (err, order) {
    if (err) {
      res.status(400).send({ message: "Order creation failed" });
      return;
    }

    const { id, status } = order || {};

    res.status(200).send({ status, orderId: id, amount: amount * 100 });
  });
};

export const verifyPayment = async (req: any, res: Response) => {
  const { orderId, paymentId, amount, email, username, contactNumber } =
    req.body;
  // console.log("username, email", name, email);
  const razorpaySignature = req.headers["x-razorpay-signature"];

  let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET || "");

  // Passing the data to be hashed
  hmac.update(orderId + "|" + paymentId);

  // Creating the hmac in the required format
  const generatedSignature = hmac.digest("hex");

  if (razorpaySignature === generatedSignature) {
    const paymentdetails = new Payment({
      orderId,
      paymentId,
      email,
      amount,
      username,
      contact_number: contactNumber,
    });
    await paymentdetails.save();

    res
      .status(200)
      .json({ success: true, message: "Payment has been verified" });
    await sendEmail(email, amount);
  } else {
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

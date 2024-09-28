import Razorpay from "razorpay";
import { config } from "dotenv";
config();

var razorpayInstance: Razorpay | undefined = undefined;

export const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY || "",
      key_secret: process.env.RAZORPAY_SECRET || "",
    });
  }

  return razorpayInstance;
};

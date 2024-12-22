import mongoose, { Schema } from "mongoose";

interface Payment {
  email: string;
  orderId: string;
  paymentId: string;
  amount: number;
  specialNote: string;
  additionalRequirements: string;
}

const Payment: Schema = new Schema({
  email: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  amount: { type: String, required: true },
  specialNote: { type: String, required: true },
  additionalRequirements: { type: String, required: true },
});
export default mongoose.model<Payment>("payment", Payment);

import express, { Router } from "express";
import {
  generateOrderId,
  verifyPayment,
} from "../controllers/paymentItegration";

export const paymentRouter: Router = express.Router();

paymentRouter.post("/order/create", generateOrderId);
paymentRouter.post("/payment/verify", verifyPayment);

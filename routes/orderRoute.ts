import express, { Router, Express } from "express";
import {
  createOrder,
  getOrderDetails,
  getAllOrderDetails,
} from "../controllers/orderController";
import { orderValidations } from "../validators/ordervalidations";
import { verifyToken } from "../utils/verifyUser";

// const { order } = orderValidations;

export const orderRouter: Router = express.Router();

orderRouter.post("/order", orderValidations.order, createOrder);
orderRouter.post("/getorder", verifyToken, getOrderDetails);
orderRouter.get("/getallorder", verifyToken, getAllOrderDetails);

import fs from "fs";
import OrderSchema from "../models/orderModel";
import Order from "../models/orderModel";
import Payment from "../models/paymentModel";

export const createOrder = async (req: any, res: any) => {
  try {
    const { addFrame, address, image, createdAt, estimatedTime } = req.body;
    console.log("createdAt", createdAt);
    console.log("estimatedTime", estimatedTime);

    const newOrder = new OrderSchema({
      image,
      addFrame: addFrame,
      address: address,
      createdAt,
      estimatedTime,
    });

    console.log("newOrder", newOrder);

    await newOrder.save();

    res
      .status(201)
      .json({ orderDetails: newOrder, message: "Order created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

export const getOrderDetails = async (req: any, res: any) => {
  const { email } = req.user;

  try {
    const collection = await Order.find({ "address.email": email });

    if (!collection) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ data: collection });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getAllOrderDetails = async (req: any, res: any) => {
  try {
    // Get pagination parameters (page, limit) from the request query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated orders and all payment details
    const orders = await Order.find().skip(skip).limit(limit);
    const payments = await Payment.find();

    // Handle cases where there are no orders or payments
    if (!payments || payments.length === 0) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Payment Details not found" });
    }
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Order not found" });
    }

    // Combine the orders and payment details by matching the email field
    const combinedResults = orders.map((order) => {
      const matchingPayment = payments.find(
        (payment) => payment.email === order?.address?.email
      );

      // If a matching payment is found, combine the order and payment details
      if (matchingPayment) {
        return {
          orderId: order._id,
          orderDetails: order,
          paymentDetails: matchingPayment,
        };
      }
      return {
        orderId: order._id,
        orderDetails: order,
        paymentDetails: null, // No payment found for this order
      };
    });

    // Send the combined results in the response
    return res.status(200).send({ status: "SUCCESS", combinedResults });
  } catch (error: any) {
    console.error(error.message);

    // Send error response
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred",
      error: error.message,
    });
  }
};

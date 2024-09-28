import express, { Express } from "express";
import { config } from "dotenv";
import DBConnect from "./config/db";
import { userRouter } from "./routes/userRoutes";
import { contactRouter } from "./routes/contactRoute";
import { orderRouter } from "./routes/orderRoute";
import cors from "cors";
import { paymentRouter } from "./routes/paymentRoute";

config();

export const app: Express = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

app.use("/api/v1", userRouter);
app.use("/api/v1", contactRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);

app.get("/", (req: any, res: any) => {
  res.send("hello");
});

DBConnect();

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});

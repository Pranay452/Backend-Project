import express, { Express } from "express";
import { config } from "dotenv";
import DBConnect from "./config/db";
import { userRouter } from "./routes/userRoutes";
import { contactRouter } from "./routes/contactRoute";
import cors from "cors";

config();

export const app: Express = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1", userRouter);
app.use("/api/v1", contactRouter);

app.get("/", (req: any, res: any) => {
  res.send("hello");
});

DBConnect();

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});

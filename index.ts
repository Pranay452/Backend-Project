// const express = require("express");
import express, { Express } from "express";
// const app = express();
// const dotenv = require("dotenv");
import { config } from "dotenv";
// const DBConnect = require("./config/db.ts");
import DBConnect from "./config/db";
import { userRouter } from "./routes/userRoutes";

config();

export const app: Express = express();

app.use(express.json());

app.use("/api/v1", userRouter);

app.get("/", (req: any, res: any) => {
  res.send("hello");
});

DBConnect();

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});

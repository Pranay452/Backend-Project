import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (
  req: Request & { user?: any },
  res: Response,
  next: Function
) => {
  const token = req.headers["authorization"] as string;
  const accessToken = token.split(" ")[1];
  if (!accessToken) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  jwt.verify(accessToken, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    req.user = user;
    next();
  });
};

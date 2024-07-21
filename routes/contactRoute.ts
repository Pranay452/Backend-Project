import express, { Router } from "express";
import { contactForm } from "../controllers/contactController";
import { verifyToken } from "../utils/verifyUser";

export const contactRouter: Router = express.Router();

contactRouter.post("/contact", contactForm);

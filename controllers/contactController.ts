import { Request, Response } from "express";
import Contact from "../models/contactModel";
export const contactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, message } =
      (req.body as unknown as {
        name: string;
        email: string;
        message: string;
      }) || {};

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save contact", error });
  }
};

import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const userValidation = {
  signUp: [
    body("username")
      .exists({ checkFalsy: true })
      .withMessage("Username is required")
      .isString()
      .withMessage("Username must be a string")
      .trim()
      .toLowerCase()
      .isLength({ min: 1, max: 15 })
      .withMessage("User name must be at least 1 character long and max 15 "),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("email")
      .exists({ checkFalsy: true })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .trim()
      .toLowerCase(),
    body("contact_number")
      .exists({ checkFalsy: true })
      .withMessage("Contact number is required")
      .isNumeric()
      .withMessage("Contact number must be numeric")
      .isLength({ min: 10, max: 15 })
      .withMessage("Contact number must be between 10 and 15 digits"),
    (req: Request, res: Response, next: Function) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ],
  signIn: [
    body("email")
      .exists({ checkFalsy: true })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .trim()
      .toLowerCase(),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),

    (req: Request, res: Response, next: Function) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ],
};

import { body, validationResult } from "express-validator";
import { Request, Response } from "express";

export const orderValidations = {
  order: [
    body("address.name")
      .exists({ checkFalsy: true })
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .trim()
      .toLowerCase()
      .isLength({ min: 3, max: 15 })
      .withMessage("Username must be at least 3 character long and max 15"),
    body("address.mobile")
      .exists({ checkFalsy: true })
      .withMessage("Mobile Number is required")
      .isNumeric()
      .withMessage("Mobile Number must be a number")
      .trim()
      .toLowerCase()
      .isLength({ min: 10, max: 10 })
      .withMessage(
        "Mobile Number must be at least 10 character long and max 10"
      ),
    body("address.email")
      .exists({ checkFalsy: true })
      .withMessage("Email is required")
      .isString()
      .withMessage("Email must be a string")
      .trim()
      .toLowerCase(),
    body("address.flat")
      .exists({ checkFalsy: true })
      .withMessage("Flat is required")
      .isString()
      .withMessage("Flat must be a string")
      .trim()
      .toLowerCase(),
    body("address.locality")
      .exists({ checkFalsy: true })
      .withMessage("Locality is required")
      .isString()
      .withMessage("Locality must be a string")
      .trim()
      .toLowerCase(),
    body("address.landmark")
      .exists({ checkFalsy: false })
      .isString()
      .withMessage("Landmark must be a string")
      .trim()
      .toLowerCase(),
    body("address.city")
      .exists({ checkFalsy: true })
      .withMessage("City is required")
      .isString()
      .withMessage("City must be a string")
      .trim()
      .toLowerCase(),
    body("address.state")
      .exists({ checkFalsy: true })
      .withMessage("State is required")
      .isString()
      .withMessage("State must be a string")
      .trim()
      .toLowerCase(),
    body("address.country")
      .exists({ checkFalsy: true })
      .withMessage("Country is required")
      .isString()
      .withMessage("Country must be a string")
      .trim()
      .toLowerCase(),
    body("address.pincode")
      .exists({ checkFalsy: true })
      .withMessage("Pincode is required")
      .isNumeric()
      .withMessage("Pincode must be a number")
      .trim()
      .toLowerCase()
      .isLength({ min: 6, max: 6 })
      .withMessage("Pincode  must be at least 1 character long and max 10"),
    (req: Request, res: Response, next: Function) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorsArray = errors.array();
        const errorMsg = errorsArray[0]?.msg;
        return res.status(422).json({
          status: "FAILED",
          message: errorMsg,
        });
      }
      next();
    },
  ],
};

import { body, validationResult } from "express-validator";

export const validateProduct = [
  body("productName")
    .trim()
    .notEmpty().withMessage("Product name is required")
    .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters"),
    
  body("productDesc")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description should be at least 10 characters"),

  body("productPrice")
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a number")
    .custom((value) => value > 0).withMessage("Price must be greater than 0"),

  body("category").notEmpty().withMessage("Category is required"),
  body("brand").notEmpty().withMessage("Brand is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg 
      });
    }
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please upload at least one product image"
        });
    }
    
    next();
  },
];


export const updateProductValidator = [
  body("productName")
    .optional() 
    .trim()
    .notEmpty().withMessage("Product name cannot be empty")
    .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters"),
    
  body("productPrice")
    .optional() 
    .isNumeric().withMessage("Price must be a number")
    .custom((value) => value > 0).withMessage("Price must be greater than 0"),

  body("productDesc").optional().trim().notEmpty(),
  body("category").optional().notEmpty(),
  body("brand").optional().notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg 
      });
    }
    next();
  },
];
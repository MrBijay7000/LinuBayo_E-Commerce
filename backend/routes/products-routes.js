const express = require("express");
const { check } = require("express-validator");
const productsControllers = require("../controllers/products-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post(
  "/addProduct",
  fileUpload.single("image"),
  [
    check("name").notEmpty().withMessage("Product name is required"),
    check("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a number and not negative"),
    check("originalPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Original price must be a non-negative number"),
    check("discount")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount must be between 0 and 100"),
    check("category").notEmpty().withMessage("Category is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer"),
  ],
  productsControllers.addProduct
);

router.patch(
  "/updateProduct/:pid",
  [
    check("name").not().isEmpty(),
    check("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a number and not negative"),
    check("originalPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Original price must be a non-negative number"),
    check("category").notEmpty().withMessage("Category is required"),
    check("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer"),
  ],
  productsControllers.updateProduct
);

router.get("/:category", productsControllers.getProductByCategory);

router.get("/getProduct/:pid", productsControllers.getProductDetails);

module.exports = router;

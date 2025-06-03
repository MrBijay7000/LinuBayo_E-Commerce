const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const Product = require("../models/Product");

const addProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { name, price, category, description, quantity, originalPrice } =
    req.body;

  const imagePath = req.file?.path.replace(/\\/g, "/");

  // Initial product data
  const productData = {
    name,
    price,
    image: imagePath,
    category,
    description,
    quantity,
  };

  // Add originalPrice if provided
  if (originalPrice !== undefined) {
    productData.originalPrice = originalPrice;

    // Calculate discount if originalPrice > 0
    if (originalPrice > 0 && price >= 0) {
      const discountPercent = ((originalPrice - price) / originalPrice) * 100;
      productData.discount = Math.round(discountPercent); // round to nearest integer
    }
  }

  const createdProduct = new Product(productData);

  try {
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const productId = req.params.pid;

  const { name, originalPrice, price, category, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new HttpError("Could not find product for the provided id.", 404)
      );
    }

    product.name = name;
    product.originalPrice = originalPrice;
    product.price = price;
    product.category = category;
    product.quantity = quantity;

    // Automatically calculate discount %
    if (originalPrice > 0 && price >= 0) {
      const discountPercent = ((originalPrice - price) / originalPrice) * 100;
      product.discount = Math.round(discountPercent); // round to nearest integer
    } else {
      product.discount = 0;
    }

    await product.save();

    // res.status(200).json({ product });
    res.status(200).json({
      product: {
        ...product.toObject(),
        discount: product.discount + "%",
      },
    });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Updating product failed.", 500));
  }
};

const getProductByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ category: category.toLowerCase() });
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const getProductDetails = async (req, res, next) => {
  try {
    const { pid } = req.params;
    if (!pid) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  // Validate product ID format
  //   if (!mongoose.Types.ObjectId.isValid(productId)) {
  //     return res.status(400).json({
  //       message: "Invalid product ID format",
  //     });
  //   }

  try {
    // Find the product first to get the image path
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imagePath = product.image;

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated image file if it exists
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete product image:", err);
          // Continue even if image deletion fails
        }
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: {
        id: productId,
        name: deletedProduct.name,
      },
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({
      message: "Failed to delete product",
      error: err.message,
    });
  }
};

// In your products controller
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = getCategories;
exports.deleteProduct = deleteProduct;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.getProductByCategory = getProductByCategory;
exports.getProductDetails = getProductDetails;

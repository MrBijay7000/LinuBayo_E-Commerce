const express = require("express");

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const usersRoutes = require("./routes/users-routes");
const productRoutes = require("./routes/products-routes");
const orderRoutes = require("./routes/order-routes");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  // res.status(error.code || 500);
  // res.json({ message: error.message || "An unknown error occured!" });
  const code = error.code && typeof error.code === "number" ? error.code : 500;
  res
    .status(code)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://thelordshadow13:kkoDtkj39X5pVGzm@cluster0.ihskd8q.mongodb.net/linubayo?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5001);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

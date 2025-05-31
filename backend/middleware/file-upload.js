// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
// };

// const fileUpload = multer({
//   limits: 500000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "uploads/images");
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, uuidv4() + "." + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const isValid = !!MIME_TYPE_MAP[file.mimetype];
//     let error = isValid ? null : new Error("Invalid mime type!");
//     cb(error, isValid);
//   },
// });

// module.exports = fileUpload;

const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Also required for fs.mkdirSync

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || "general";
    const uploadPath = path.join("uploads", "images", category);

    fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if not exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileUpload = multer({
  storage: fileStorage,
  limits: { fileSize: 5000000 }, // optional: limit file size (5MB)
});

module.exports = fileUpload;

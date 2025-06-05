const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const otpStore = new Map();

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //   if (!error.isEmpty()) {
  //     return res.status(422).json({
  //       message: "Validation failed",
  //       errors: error.array(),
  //     });
  //   }

  const { name, email, phonenumber, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please log in instead.",
      422
    );
    return next(error);
  }

  const role = email === "admin@admin.com" ? "admin" : "user"; // optional logic
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again later.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    phonenumber,
    password: hashedPassword,
    role,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    phonenumber: createdUser.phonenumber,
    token,
    role: createdUser.role,
    message: "User Created",
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Invalid credentials, could not log you in please check your credentials and try againa.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: createdUser.role,
      },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    message: "Logged In",
    userId: existingUser.id,
    email: existingUser.email,
    token,
    role: existingUser.role,
  });
};

const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();

  if (!email) return res.status(400).json({ message: "Email is required" });

  // ✅ Check if user already exists
  let existingUser;
  try {
    // existingUser = await User.findOne({ email });
    existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" }); // 409 = Conflict
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "mr.bijaystha42@gmail.com",
      pass: "pqfygudcylmnntjg",
    },
  });

  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent" });

    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOtp = otpStore.get(email);

  if (!storedOtp) {
    return res.status(400).json({ message: "OTP has expired or was not sent" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  otpStore.delete(email);
  return res.status(200).json({ message: "OTP verified" });
};

// In your usersControllers.getDetails
const getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email address");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        // Make sure this matches what your frontend expects
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    // Get all users from the database, excluding only the password field
    const users = await User.find({}, "-password");

    // Return all users regardless of role
    res.json({ users });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }
};

exports.signup = signup;
exports.login = login;
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.getDetails = getDetails;
exports.getAllCustomers = getAllCustomers;

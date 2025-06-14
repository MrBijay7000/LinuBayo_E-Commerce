const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const router = express.Router();
const auth = require("../middleware/auth");

// router.get("/", userControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phonenumber")
      .isMobilePhone("ne-NP")
      .withMessage("Please Enter 10 Digit Phone Number"),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

// router.post(
//   "/signup",
//   [
//     check("name").not().isEmpty().withMessage("Name is required"),
//     check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
//     check("phonenumber")
//       .isMobilePhone("ne-NP")
//       .withMessage("Invalid Nepali mobile number"),
//     check("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters long"),
//   ],
//   usersControllers.signup
// );

router.post("/login", usersControllers.login);
router.post("/send-otp", usersControllers.sendOtp);
router.post("/verify-otp", usersControllers.verifyOtp);
router.get("/me", auth, usersControllers.getDetails);
router.get("/getCustomers", auth, usersControllers.getAllCustomers);

module.exports = router;

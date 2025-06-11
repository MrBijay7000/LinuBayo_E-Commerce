import Card from "../../shared/UIElements/Card";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
import { toast } from "react-toastify";
import "./AuthPage.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../shared/Context/auth-context";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    isLoginMode
      ? {
          email: { value: "", isValid: false },
          password: { value: "", isValid: false },
        }
      : {
          name: { value: "", isValid: false },
          email: { value: "", isValid: false },
          phonenumber: { value: "", isValid: false },
          password: { value: "", isValid: false },
        },
    false
  );

  const toggleForm = () => {
    setOtp("");
    setStep("signup");
    setIsLoginMode((prevMode) => !prevMode);

    // Reset form with proper structure and validation state
    if (isLoginMode) {
      setFormData(
        {
          name: { value: "", isValid: false },
          email: { value: "", isValid: false },
          phonenumber: { value: "", isValid: false },
          password: { value: "", isValid: false },
        },
        false
      );
    } else {
      setFormData(
        {
          email: { value: "", isValid: false },
          password: { value: "", isValid: false },
        },
        false
      );
    }
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!isLoginMode) {
        if (step === "signup") {
          await sendOtp();
          return;
        } else if (step === "otp") {
          await verifyOtp();
          return;
        }
      }

      // Login logic
      const responseData = await sendRequest(
        "http://localhost:5001/api/users/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        { "Content-Type": "application/json" }
      ).catch((err) => {
        throw err;
      });

      auth.login(responseData.userId, responseData.token, responseData.role);
      toast.success("Login successful!");
      if (responseData.role === "admin") {
        navigate("/admin/homepage");
      } else {
        navigate("/");
      }
    } catch (err) {
      // toast.error(err.message || "Authentication failed. Please try again.");
      throw err;
    }
  };

  const sendOtp = async () => {
    setIsSendingOtp(true);
    try {
      await sendRequest(
        "http://localhost:5001/api/users/send-otp",
        "POST",
        JSON.stringify({ email: formState.inputs.email.value }),
        { "Content-Type": "application/json" }
      );

      toast.info("OTP sent to your email. Check your inbox!");
      setStep("otp");
    } catch (err) {
      if (err.message.includes("User already exists")) {
        toast.error("This email is already registered. Please log in.");
      }
      toast.error(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    try {
      // Verify OTP
      const otpResponse = await sendRequest(
        "http://localhost:5001/api/users/verify-otp",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          otp,
        }),
        { "Content-Type": "application/json" }
      );

      // Proceed with signup after OTP verification
      const signupResponse = await sendRequest(
        "http://localhost:5001/api/users/signup",
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          phonenumber: formState.inputs.phonenumber.value,
          password: formState.inputs.password.value,
        }),
        { "Content-Type": "application/json" }
      );

      // Automatically log in the user
      const loginResponse = await sendRequest(
        "http://localhost:5001/api/users/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        { "Content-Type": "application/json" }
      );
      console.log(loginResponse);

      auth.login(loginResponse.userId, loginResponse.token, loginResponse.role);
      console.log(loginResponse);
      toast.success("Account created successfully! Welcome!");
      if (loginResponse.role === "admin") {
        navigate("/admin/homepage");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {(isLoading || isSendingOtp) && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "LOGIN" : "CREATE ACCOUNT"}</h2>
        <form
          onSubmit={authSubmitHandler}
          key={isLoginMode ? "login" : "signup"}
        >
          {!isLoginMode && step === "signup" && (
            <>
              <Input
                id="name"
                element="input"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your name"
                onInput={inputHandler}
              />
              <Input
                id="phonenumber"
                element="input"
                type="tel"
                label="Phone Number"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid phone number"
                onInput={inputHandler}
              />
            </>
          )}

          {step === "signup" && (
            <>
              <Input
                id="email"
                element="input"
                type="email"
                label="Email"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address"
                onInput={inputHandler}
              />
              <Input
                id="password"
                element="input"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Password must be at least 6 characters"
                onInput={inputHandler}
              />
            </>
          )}

          {step === "otp" && (
            <div className="otp-container">
              <Input
                id="otp"
                element="input"
                type="text"
                label="Verification Code"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter the 6-digit code"
                onInput={(id, value) => setOtp(value)}
              />
              <p className="otp-hint">
                We've sent a verification code to your email
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              isLoading ||
              isSendingOtp ||
              (isLoginMode
                ? !formState.isValid
                : step === "signup"
                ? !formState.isValid
                : !otp)
            }
          >
            {isLoading
              ? "Processing..."
              : isSendingOtp
              ? "Sending OTP..."
              : isLoginMode
              ? "LOGIN"
              : step === "signup"
              ? "SIGN UP"
              : "VERIFY OTP"}
          </Button>
        </form>

        <div className="auth-footer">
          <p className="auth-toggle">
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}
            <button onClick={toggleForm}>
              {isLoginMode ? "Sign Up" : "Login"}
            </button>
          </p>
          {step === "otp" && (
            <button
              type="button"
              onClick={sendOtp}
              disabled={isSendingOtp}
              className="resend-otp-btn"
            >
              {isSendingOtp ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>
      </Card>
    </>
  );
}

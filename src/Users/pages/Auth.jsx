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

export default function AuthPage() {
  const auth = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // or 'otp'

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);

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

  function toggleForm() {
    setOtp("");
    setStep("signup");

    if (!isLoginMode) {
      // Switching to login
      setFormData(
        {
          email: { value: "", isValid: false },
          password: { value: "", isValid: false },
        },
        false
      );
    } else {
      // Switching to signup
      setFormData(
        {
          name: { value: "", isValid: false },
          email: { value: "", isValid: false },
          phonenumber: { value: "", isValid: false },
          password: { value: "", isValid: false },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  }

  async function authSubmitHandler(event) {
    event.preventDefault();

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
    try {
      const responseData = await sendRequest(
        "http://localhost:5001/api/users/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      console.log(responseData);

      auth.login(responseData.userId, responseData.token);
    } catch (err) {
      console.log(err.message);
    }
  }

  const sendOtp = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5001/api/users/send-otp",
        "POST",
        JSON.stringify({ email: formState.inputs.email.value }),
        { "Content-Type": "application/json" }
      );

      const data = await responseData.json();
      //   console.log(data);

      //   if (!res.ok) {
      //     if (res.status === 409) {
      //       throw new Error("This email is already registered. Please log in.");
      //     }
      //     throw new Error(data.message || "Something went wrong");
      //   }

      toast.info("OTP sent to your email.");
      setStep("otp");
    } catch (err) {
      toast.error(err.message || "Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      // Verify OTP first
      const res = await sendRequest(
        "http://localhost:5001/api/users/verify-otp",
        "POST",
        JSON.stringify({ email: formState.inputs.email.value, otp }),
        { "Content-Type": "application/json" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // If OTP is valid, proceed with signup
      const signupRes = await sendRequest(
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

      auth.login(loginData.userId, loginData.token);

      //   const signupData = await signupRes.json();
      //   if (!signupRes.ok) {
      //     throw new Error(signupData.message);
      //   }

      // Automatically log in the user after successful signup
      //   const loginRes = await fetch("http://localhost:5001/api/users/login", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       email: formState.inputs.email.value,
      //       password: formState.inputs.password.value,
      //     }),
      //   });

      //   const loginData = await loginRes.json();
      //   if (!loginRes.ok) throw new Error(loginData.message);

      //   // Log the user in and redirect to home

      //   auth.login(loginData.userId, loginData.token);
      toast.success("Signup successful! Welcome!");
    } catch (err) {
      toast.error(err.message || "OTP verification failed.");
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>LOGIN REQUIRED!</h2>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && step === "signup" && (
            <>
              <Input
                id="name"
                element="input"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid name"
                onInput={inputHandler}
              />
              <Input
                id="phonenumber"
                element="input"
                type="number"
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
                label="E-Mail"
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
                errorText="Please enter a valid password. (At least 6 Characters)"
                onInput={inputHandler}
              />
            </>
          )}

          {step === "otp" && (
            <>
              <Input
                id="otp"
                element="input"
                type="text"
                label="Enter OTP"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter the OTP sent to your email."
                onInput={(id, value) => setOtp(value)}
              />
            </>
          )}

          {/* <Button
            type="submit"
            disabled={
              isLoginMode
                ? !formState.isValid
                : step === "signup" && !formState.isValid
            }
          >
            {isLoginMode
              ? "LOGIN"
              : step === "signup"
              ? "SIGN UP"
              : "VERIFY OTP"}
          </Button> */}
          <Button
            type="submit"
            disabled={
              isLoading ||
              (isLoginMode
                ? !formState.isValid
                : step === "signup" && !formState.isValid)
            }
          >
            {isLoading
              ? isLoginMode
                ? "Logging in..."
                : step === "signup"
                ? "Signing up..."
                : "Verifying OTP..."
              : isLoginMode
              ? "LOGIN"
              : step === "signup"
              ? "SIGN UP"
              : "VERIFY OTP"}
          </Button>
        </form>

        <p className="auth-toggle">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleForm}>
            {isLoginMode ? "Sign Up" : "Login"}
          </button>
        </p>
      </Card>
    </>
  );
}

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

export default function Auth() {
  const auth = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // signup → otp

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  function toggleForm() {
    setStep("signup");
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          phonenumber: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          phonenumber: { value: "", isValid: false },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  }

  const formValues = {
    name: formState.inputs.name?.value,
    email: formState.inputs.email.value,
    phonenumber: formState.inputs.phonenumber?.value,
    password: formState.inputs.password.value,
  };

  async function authSubmitHandler(event) {
    event.preventDefault();

    if (!isLoginMode) {
      if (step === "signup") {
        await sendOtp();
        setIsLoading(false);
        return;
      } else if (step === "otp") {
        await verifyOtp();
        return;
      }
    }

    // Login logic
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);

      //   const responseData = await response.json();
      //   if (!response.ok) throw new Error(responseData.message);
      //   setIsLoading(false);

      // Pass userId and token to auth context
      //   auth.login(responseData.userId, responseData.token);

      //   setIsLoading(false);
      auth.login();
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong, please try again later.");
    }
  }

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formState.inputs.email.value }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("This email is already registered. Please log in.");
        }
        throw new Error(data.message || "Something went wrong");
      }

      toast.info("OTP sent to your email.");
      setStep("otp");
    } catch (err) {
      toast.error(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5001/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formState.inputs.email.value, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const signupRes = await fetch("http://localhost:5001/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) {
        if (signupRes.status === 422) {
          throw new Error("User already exists. Please log in.");
        }
        throw new Error(signupData.message);
      }

      toast.success("Signup successful! Please login.");
      setIsLoginMode(true);
      setStep("signup");
    } catch (err) {
      toast.error(err.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  function errorHandler() {
    setError(null);
  }

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "LOGIN REQUIRED!" : "CREATE ACCOUNT"}</h2>
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
            errorText="Please enter a valid password. (At least 6 characters)"
            onInput={inputHandler}
          />

          {!isLoginMode && step === "otp" && (
            <Input
              id="otp"
              element="input"
              type="text"
              label="Enter OTP"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter the OTP sent to your email."
              onInput={(id, value) => setOtp(value)}
            />
          )}

          <Button
            type="submit"
            disabled={
              isLoginMode
                ? !formState.isValid
                : step === "signup"
                ? !formState.isValid
                : otp.length !== 6
            }
          >
            {isLoginMode
              ? "LOGIN"
              : step === "signup"
              ? "SEND OTP"
              : "VERIFY OTP & SIGNUP"}
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

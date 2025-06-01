import Card from "../../shared/UIElements/Card";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";

import "./AuthPage.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../shared/Context/auth-context";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";

export default function AuthPage() {
  const auth = useContext(AuthContext);
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
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          //   image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          //   image: {
          //     value: null,
          //     isValid: false,
          //   },
          phonenumber: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  }

  async function authSubmitHandler(event) {
    event.preventDefault();

    if (isLoginMode) {
    } else {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            phonenumber: formState.inputs.phonenumber.value,
            password: formState.inputs.password.value,
          }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        console.log(responseData);
        setIsLoading(false);
        auth.login();
      } catch (err) {
        console.log(err);
        setIsLoading(false);

        setError(
          err.message || "Something went wrong, please try again later."
        );
      }
    }
  }

  function errorHandler() {
    setError(null);
  }

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>LOGIN REQUIRED!</h2>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
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
            errorText="Please enter a valid password. (Atleast 6 Characters)"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
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

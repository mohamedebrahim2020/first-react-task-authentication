import { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ValidationError from "../error/ValidationError";
import useAxios from "../../hooks/use-axios";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";
import { clientCredentials } from "../../credentials/AppCredentials";

const AuthForm = () => {
  const loginInitialValues = {
    email: "",
    password: "",
  };

  const signupInitialValues = {
    email: "",
    password: "",
    password_confirmation: "",
    user_name: "",
    phone_number: "",
  };

  const loginValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
  });

  const signupValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required").min(8),
    password_confirmation: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    user_name: Yup.string()
      .required("Required")
      .matches(/^\S*$/, "spaces are not permitted"),
    phone_number: Yup.string().required("Required"),
  });
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [apiGeneralError, setApiGeneralError] = useState();
  const [apiEmailError, setApiEmailError] = useState();
  const [apiPhoneError, setApiPhoneError] = useState();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setApiEmailError();
    setApiPhoneError();
    setApiGeneralError();
  };

  const { isLoading, errors, sendRequest: sendAuthRequest } = useAxios();

  const authInformation = (response) => {
    const data = response.data;
    const expirationTime = new Date(
      new Date().getTime() + +data.expires_in * 1000
    );
    authCtx.login(data.access_token, expirationTime.toISOString());
    history.replace("/users");
  };
  useEffect(() => {
    if (errors && !isLoading) {
      console.log(errors);
      handleError(errors);
    }
  }, [isLoading, errors]);

  const handleError = (errors) => {
    if (errors.status != 422) {
      setApiGeneralError(errors.statusText);
    }

    if (errors.status == 422) {
      const emailError = errors.data.errors.filter(
        (error) => error.type === "email"
      );
      const phoneError = errors.data.errors.filter(
        (error) => error.type === "mobile_number"
      );
      if (emailError.length === 1) {
        setApiEmailError(emailError[0].error);
      }
      if (phoneError.length === 1) {
        setApiPhoneError(phoneError[0].error);
      }
    }
  };
  const authRegistration = (response) => {
    if (response.length === 0) {
      setApiEmailError("");
      setApiPhoneError("");
      alert("successfully registered now you can login");
      setIsLogin(true);
    }
    history.replace("/users");
  };
  const submitHandler = (values) => {
    // event.preventDefault();
    const enteredEmail = values.email;
    const enteredPassword = values.password;
    // optional: Add validation

    if (isLogin) {
      const loginData = {
        ...clientCredentials,
        ...{ email: enteredEmail, password: enteredPassword },
      };
      let api = "api/v1/users/login";

      sendAuthRequest(
        {
          api: api,
          method: "post",
          body: loginData,
          headers: {
            "Content-Type": "application/json",
          },
        },
        authInformation
      );
    } else {
      const passwordConfirmation = values.password_confirmation;
      const userName = values.user_name;
      const phoneNumber = values.phone_number;
      const registerData = {
        ...clientCredentials,
        ...{
          name: userName,
          email: enteredEmail,
          password: enteredPassword,
          password_confirmation: passwordConfirmation,
          mobile_number: phoneNumber,
        },
      };
      let api = "api/v1/users";

      sendAuthRequest(
        {
          api: api,
          method: "post",
          body: registerData,
          headers: {
            "Content-Type": "application/json",
          },
        },
        authRegistration
      );
    }
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <Formik
        initialValues={isLogin ? loginInitialValues : signupInitialValues}
        validationSchema={
          isLogin ? loginValidationSchema : signupValidationSchema
        }
        onSubmit={submitHandler}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <Field
              type="email"
              id="email"
              name="email"
            />
            <ErrorMessage name="email" component={ValidationError} />
            {apiEmailError && (
              <div>
                <span className="color:red"> {apiEmailError}</span>
              </div>
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Your Password</label>
            <Field
              type="password"
              id="password"
              name="password"
            />
            <ErrorMessage name="password" component={ValidationError} />
          </div>
          {!isLogin && (
            <>
              <div className={classes.control}>
                <label htmlFor="password_confirmation">
                  Password confirmation
                </label>
                <Field
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                />
                <ErrorMessage
                  name="password_confirmation"
                  component={ValidationError}
                />
              </div>
              <div className={classes.control}>
                <label htmlFor="user_name">user name</label>
                <Field
                  type="text"
                  id="user_name"
                  name="user_name"
                />
                <ErrorMessage name="user_name" component={ValidationError} />
              </div>
              <div className={classes.control}>
                <label htmlFor="phone number">phone number</label>
                <Field
                  type="text"
                  id="phone_number"
                  name="phone_number"
                />
                <ErrorMessage name="phone_number" component={ValidationError} />
                {apiPhoneError && (
                  <div>
                    {" "}
                    <span className="color:red"> {apiPhoneError}</span>
                  </div>
                )}
              </div>
            </>
          )}
          {apiGeneralError && (
            <div>
              {" "}
              <span className="color:red"> {apiGeneralError}</span>
            </div>
          )}
          <div className={classes.actions}>
            {!isLoading && (
              <button>{isLogin ? "Login" : "Create Account"}</button>
            )}
            {isLoading && <p>Sending request...</p>}
            <button
              type="button"
              role="switchButton"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          </div>
        </Form>
      </Formik>
      {isLogin && (
        <div className={classes.actions}>
          <button>
            <Link to="/forget/password">Forget Password</Link>
          </button>
        </div>
      )}
    </section>
  );
};

export default AuthForm;

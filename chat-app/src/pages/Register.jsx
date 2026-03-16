import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import styled from "styled-components";
import Logo from "../assets/1chat.png";
import "./pagesStyles.css";
import { toast } from "react-toastify"; //Toast is a new thing ****
import axios from "axios";
import { apiConfigurationError, registerRoute } from "../utils/Api.Routes";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function Register() {
  const navigate = useNavigate();

  ///logic part
  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confermPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toastOption = {
    position: "bottom-right",
    autoClose: 8080,
    pauseOnHover: true,
    dragable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (handleValidation()) {
      if (apiConfigurationError) {
        toast.error(apiConfigurationError, toastOption);
        return;
      }

      try {
        setIsSubmitting(true);
        const { data } = await axios.post(registerRoute, values);

        if (data.success === false) {
          toast.error(data.message, toastOption);
        }

        if (data.success === true) {
          toast.success("Registration successful", toastOption);
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/setavatar");
        }
      } catch (error) {
        console.error("Register request failed:", {
          message: error.message,
          url: error.config?.url,
          response: error.response?.data,
        });

        toast.error(
          error.response?.data?.message || "Unable to connect to the server",
          toastOption
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // handleValidation
  const handleValidation = () => {
    const { password, confermPassword, username, email } = values;
    if (password !== confermPassword) {
      toast.error("password dosen't match", toastOption);
      return false;
    } else if (username.length < 3) {
      toast.error("username to short", toastOption);
      return false;
    } else if (password.length < 3) {
      toast.error("password to short", toastOption);
      return false;
    } else if (email === "") {
      toast.error("email required", toastOption);
      return false;
    }

    return true;
  };
  // form value change ***
  const handleChange = (e) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  ///ui design
  return (
    <>
      <div className="FormContainer">
        <form className="form" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="" className="brandLogo" />
            <h1>one-chat</h1>
          </div>
          <div className="inputContainer">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <div className="passwordField">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={(e) => handleChange(e)}
              />
              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
            <div className="passwordField">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Conferm Password"
                name="confermPassword"
                onChange={(e) => handleChange(e)}
              />
              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>
          <button type="submit" className="registerButton" disabled={isSubmitting}>
            {isSubmitting ? "Creating user..." : "create user"}
          </button>
          <span className="rspan">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </>
  );
}

// styleing

export default Register;

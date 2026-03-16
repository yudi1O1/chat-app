import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import styled from "styled-components";
import Logo from "../assets/1chat.png";
import "./pagesStyles.css";
import { toast } from "react-toastify"; //Toast is a new thing ****
import axios from "axios";
import { apiConfigurationError, loginRoute } from "../utils/Api.Routes";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { createGuestUser, saveGuestUser } from "../utils/guestMode";

function Login() {
  const navigate = useNavigate();

  ///logic part
  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confermPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
        const { password, email } = values;
        const { data } = await axios.post(loginRoute, {
          email,
          password,
        });

        if (data.success === false) {
          toast.error(data.message, toastOption);
        }

        if (data.success === true) {
          toast.success("Logged in successfully", toastOption);
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/");
        }
      } catch (error) {
        console.error("Login request failed:", {
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
    const { password, email } = values;
    if (password === " ") {
      toast.error("password please", toastOption);
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

  const loginAsGuest = () => {
    const guestUser = createGuestUser();
    saveGuestUser(guestUser);
    toast.success("Guest mode enabled. Nothing will be saved to the database.", toastOption);
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      // navigate('/')
    }
  },[])

  ///ui design
  return (
    <>
      <div className="FormContainer">
        <form className="form" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="" className="brandLogo" />
            <h1 className="wordmark">ONE-CHAT</h1>
          </div>
          <div className="inputContainer">
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
          </div>
          <button type="submit" className="registerButton" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            className="registerButton registerButton--secondary"
            onClick={loginAsGuest}
            disabled={isSubmitting}
          >
            Login as guest
          </button>
          <p className="formHint">Guest mode keeps all chat changes local to this browser only.</p>
          <span className="rspan">
            dont have a account? <Link to="/register">register</Link>
          </span>
        </form>
      </div>
    </>
  );
}

// styleing

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/1chat.png";
import "./pages.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/Api.Routes";

function Register() {
  const navigate = useNavigate();

  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confermPassword: "",
  });

  const toastOption = {
    position: "bottom-right",
    autoClose: 8080,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      const { username, email, password } = values;

      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        if (data.success === false) {
          toast.error(data.message, toastOption);
        } else if (data.success === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.res));
          navigate("/"); // Redirect directly to home page
        }
      } catch (error) {
        toast.error("Registration failed. Try again.", toastOption);
      }
    }
  };

  const handleValidation = () => {
    const { password, confermPassword, username, email } = values;

    if (password !== confermPassword) {
      toast.error("Passwords don't match", toastOption);
      return false;
    } else if (username.length < 3) {
      toast.error("Username too short", toastOption);
      return false;
    } else if (password.length < 3) {
      toast.error("Password too short", toastOption);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOption);
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setValue({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="FormContainer">
        <form className="form" onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" className="brandLogo" />
            <h1>one-chat</h1>
          </div>
          <div className="inputContainer">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confermPassword"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="registerButton">
            Create User
          </button>
          <span className="rspan">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;

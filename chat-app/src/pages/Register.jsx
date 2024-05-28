import React,{useState,useEffect} from "react";
import { Link ,useNavigate} from "react-router-dom";
// import styled from "styled-components";
import Logo from "../assets/logo.svg";
import "./pages.css";
import { ToastContainer, toast } from "react-toastify" //Toast is a new thing ****
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { registerRoute } from "../utils/Api.Routes";

function Register() {
  const navigate = useNavigate()

  ///logic part
  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confermPassword:"",
  })

  const toastOption = {
      position: "bottom-right",
      autoClose: 8080,
      pauseOnHover: true,
      dragable: true,
      theme:"dark",
}


  const handleSubmit = async(event) => {
    event.preventDefault();
    
    if (handleValidation()) {

      const { password, confermPassword, username, email } = values;
      const { data } = await axios.post(registerRoute, values);
      console.log(data);
      if (data.success === false) {
        toast.error(data.message,toastOption)
      }
      if (data.success === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.res))
        navigate("/login")
      }
      

    }
  };

  // handleValidation
  const handleValidation = () => {
    const { password, confermPassword, username, email } = values;
    if (password !== confermPassword) {
      toast.error("password dosen't match", toastOption)
      return false
    } else if (username.length < 3) {
      toast.error('username to short', toastOption)
      return false
    } else if (password.length < 3) {
      toast.error('password to short', toastOption)
      return false
    }  else if (email === "") {
      toast.error('email required', toastOption)
      return false
    } 

    return true
    
  }
  // form value change ***
  const handleChange = (e) => {
    setValue({...values,[e.target.name]:e.target.value})
  };



///ui design
  return (
    <>
      <div className="FormContainer">
        <form className="form" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="" className="brandLogo" />
            <h1>snappy</h1>
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
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Conferm Password"
              name="confermPassword"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button type="submit" className="registerButton">
            create user
          </button>
          <span className="rspan">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
}

// styleing

export default Register;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./pages.css";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify"; //Toast is a new thing ****
import "react-toastify/dist/ReactToastify.css"; //toastify css file
import { Buffer } from "buffer";
import axios from "axios";
import { setAvatarRoute } from "../utils/Api.Routes";

function SetAvatar() {
  const proxy = "https://cors-anywhere.herokuapp.com/";

  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOption = {
    position: "bottom-right",
    autoClose: 8080,
    pauseOnHover: true,
    dragable: true,
    theme: "dark",
  };
  //if no user present
  if (!localStorage.getItem("chat-app-user")) {
    navigate("/login");
  }

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("please select a profile picture", toastOption);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      console.log(data);
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOption);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      try {
        for (let i = 0; i < 4; i++) {
          const response = await axios.get(
            `${proxy}https://api.multiavatar.com/${Math.round(
              Math.random() * 1000
            )}`,
            { responseType: "arraybuffer" }
          );
          const buffer = Buffer.from(response.data, "binary");
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loader-cont">
          <img src={loader} alt="loader" className="loader" />
        </div>
      ) : (
        <div className="SetAvatarContainer">
          <div className="titleContainer">
            <h1 className="title">Pick an avatar as profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
              </div>
            ))}
          </div>
          <button className="setprofilebtn" onClick={setProfilePicture}>
            Set as profile
          </button>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default SetAvatar;

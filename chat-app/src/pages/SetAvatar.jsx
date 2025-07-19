import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/Api.Routes";

function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOption = {
    position: "bottom-right",
    autoClose: 8080,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select a profile picture", toastOption);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar], // Send avatar URL
        });

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastOption);
        }
      } catch (err) {
        toast.error("Failed to set profile picture", toastOption);
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = () => {
      const avatarList = [];
      for (let i = 0; i < 4; i++) {
        // const seed = Math.floor(Math.random() * 1000000); // Large random seed
        const avatarUrl = `https://api.multiavatar.com/45678945/584`;
        avatarList.push(avatarUrl);
      }
      setAvatars(avatarList);
      setIsLoading(false);
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
                <img src={avatar} alt={`avatar-${index}`} />
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pagesStyles.css";
import loader from "../assets/loader.gif";
import { toast } from "react-toastify";
import axios from "axios";
import multiavatar from "@multiavatar/multiavatar/esm";
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
      if (user?.isGuest) {
        user.isAvatarImageSet = true;
        user.avatarImage = avatars[selectedAvatar];
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        localStorage.setItem("selectedAvatar", selectedAvatar);
        toast.success("Guest avatar updated for this browser session", toastOption);
        navigate("/");
        return;
      }

      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar], // This is now a base64 SVG string
        });

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));

          // Save selected avatar index too
          localStorage.setItem("selectedAvatar", selectedAvatar);
          toast.success("Profile picture updated", toastOption);

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
    const savedAvatars = localStorage.getItem("avatars");
    const savedSelected = localStorage.getItem("selectedAvatar");

    if (savedAvatars) {
      setAvatars(JSON.parse(savedAvatars));
      setIsLoading(false);
      if (savedSelected !== null) {
        setSelectedAvatar(Number(savedSelected));
      }
    } else {
      // Generate new avatars
      const avatarList = [];
      for (let i = 0; i < 4; i++) {
        const seed = Math.floor(Math.random() * 1000000).toString();
        const svgCode = multiavatar(seed);
        const base64Svg = `data:image/svg+xml;base64,${btoa(svgCode)}`;
        avatarList.push(base64Svg);
      }
      setAvatars(avatarList);
      localStorage.setItem("avatars", JSON.stringify(avatarList));
      setIsLoading(false);
    }
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
                // className="selected"
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => {
                  setSelectedAvatar(index);
                  localStorage.setItem("selectedAvatar", index); // Save choice immediately
                }}
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
    </>
  );
}

export default SetAvatar;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { updateSettingsRoute } from "../utils/Api.Routes";
import DefaultAvatar from "../assets/default-avatar.svg";

function SettingsPanel({ currentUser, isOpen, onClose, onUserUpdated }) {
  const navigate = useNavigate();
  const [about, setAbout] = useState(currentUser?.about || "");
  const [lastSeenVisibility, setLastSeenVisibility] = useState(
    currentUser?.settings?.lastSeenVisibility || "everyone"
  );
  const [profilePhotoVisibility, setProfilePhotoVisibility] = useState(
    currentUser?.settings?.profilePhotoVisibility || "everyone"
  );
  const [readReceipts, setReadReceipts] = useState(
    currentUser?.settings?.readReceipts ?? true
  );
  const [notifications, setNotifications] = useState(
    currentUser?.settings?.notifications ?? true
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser && isOpen) {
      setAbout(currentUser.about || "");
      setLastSeenVisibility(currentUser.settings?.lastSeenVisibility || "everyone");
      setProfilePhotoVisibility(
        currentUser.settings?.profilePhotoVisibility || "everyone"
      );
      setReadReceipts(currentUser.settings?.readReceipts ?? true);
      setNotifications(currentUser.settings?.notifications ?? true);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) {
    return null;
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data } = await axios.put(`${updateSettingsRoute}/${currentUser._id}`, {
        about,
        lastSeenVisibility,
        profilePhotoVisibility,
        readReceipts,
        notifications,
      });

      if (data.success) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        onUserUpdated(data.user);
        onClose();
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <aside className="settings-panel" onClick={(event) => event.stopPropagation()}>
        <div className="settings-panel__header">
          <div>
            <h2>Settings</h2>
            <p>Privacy, profile, and chat preferences</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="settings-panel__section">
          <h3>Profile</h3>
          <div className="settings-avatar-card">
            <div className="avatar avatar--settings">
              <img
                src={currentUser.avatarImage || DefaultAvatar}
                alt={currentUser.username}
              />
            </div>
            <div className="settings-avatar-card__body">
              <strong>Profile picture</strong>
              <p>Update how your profile appears in chats and contact lists.</p>
            </div>
          </div>
          <label className="settings-field">
            <span>About</span>
            <input
              type="text"
              value={about}
              maxLength={120}
              onChange={(event) => setAbout(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/setavatar")}
          >
            Change profile picture
          </button>
        </div>

        <div className="settings-panel__section">
          <h3>Privacy</h3>
          <label className="settings-field">
            <span>Last seen</span>
            <select
              value={lastSeenVisibility}
              onChange={(event) => setLastSeenVisibility(event.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </label>
          <label className="settings-field">
            <span>Profile photo</span>
            <select
              value={profilePhotoVisibility}
              onChange={(event) => setProfilePhotoVisibility(event.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </label>
        </div>

        <div className="settings-panel__section">
          <h3>Chats</h3>
          <label className="toggle-row">
            <span>Read receipts</span>
            <input
              type="checkbox"
              checked={readReceipts}
              onChange={(event) => setReadReceipts(event.target.checked)}
            />
          </label>
          <label className="toggle-row">
            <span>Desktop notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) => setNotifications(event.target.checked)}
            />
          </label>
          <div className="settings-tip">
            <strong>Suggested features</strong>
            <p>Blocked contacts, disappearing messages, starred messages, media auto-download, and message backup.</p>
          </div>
        </div>

        <div className="settings-panel__footer">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SettingsPanel;

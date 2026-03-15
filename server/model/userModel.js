const mongoose = require('mongoose')

const newUser = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default:"",
    },
    about: {
        type: String,
        default: "Hey there! I am using one-chat.",
        trim: true,
        maxlength: 120,
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
    settings: {
        lastSeenVisibility: {
            type: String,
            enum: ["everyone", "contacts", "nobody"],
            default: "everyone",
        },
        profilePhotoVisibility: {
            type: String,
            enum: ["everyone", "contacts", "nobody"],
            default: "everyone",
        },
        readReceipts: {
            type: Boolean,
            default: true,
        },
        enterToSend: {
            type: Boolean,
            default: true,
        },
        notifications: {
            type: Boolean,
            default: true,
        },
    },
   
}, {
    timestamps: true,
});

module.exports = mongoose.model("Users",newUser)

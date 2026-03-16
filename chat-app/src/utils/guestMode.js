const GUEST_USER_STORAGE_KEY = "chat-app-user";
const GUEST_CONVERSATIONS_STORAGE_KEY = "chat-app-guest-conversations";
const GUEST_MESSAGES_STORAGE_KEY = "chat-app-guest-messages";

const guestContacts = [
  {
    _id: "guest-contact-1",
    username: "Ava",
    about: "Product designer who replies fast.",
    avatarImage: "",
    lastSeen: new Date().toISOString(),
    settings: {
      lastSeenVisibility: "everyone",
      profilePhotoVisibility: "everyone",
      readReceipts: true,
      notifications: true,
    },
  },
  {
    _id: "guest-contact-2",
    username: "Noah",
    about: "Frontend engineer and coffee fan.",
    avatarImage: "",
    lastSeen: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    settings: {
      lastSeenVisibility: "everyone",
      profilePhotoVisibility: "everyone",
      readReceipts: true,
      notifications: true,
    },
  },
  {
    _id: "guest-contact-3",
    username: "Mia",
    about: "Likes thoughtful product feedback.",
    avatarImage: "",
    lastSeen: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    settings: {
      lastSeenVisibility: "everyone",
      profilePhotoVisibility: "everyone",
      readReceipts: true,
      notifications: true,
    },
  },
];

const defaultGuestMessages = {
  "guest-contact-1": [
    {
      fromSelf: false,
      message: "Hey there! Welcome to guest mode.",
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      fromSelf: true,
      message: "Nice, I just wanted to explore the chat app.",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ],
  "guest-contact-2": [
    {
      fromSelf: false,
      message: "You can try chats, settings, and avatars here.",
      createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
  ],
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function createGuestUser() {
  return {
    _id: "guest-user",
    username: "Guest Explorer",
    email: "guest@one-chat.local",
    about: "Previewing the app without saving anything to the database.",
    avatarImage: "",
    isAvatarImageSet: true,
    isGuest: true,
    settings: {
      lastSeenVisibility: "everyone",
      profilePhotoVisibility: "everyone",
      readReceipts: true,
      notifications: true,
    },
  };
}

export function saveGuestUser(user) {
  localStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(user));
}

export function ensureGuestState() {
  const storedUser = readJson(GUEST_USER_STORAGE_KEY, null);
  const guestUser = storedUser?.isGuest ? storedUser : createGuestUser();
  saveGuestUser(guestUser);

  const messages = readJson(GUEST_MESSAGES_STORAGE_KEY, null) || defaultGuestMessages;
  writeJson(GUEST_MESSAGES_STORAGE_KEY, messages);

  const conversations = buildGuestConversations(messages);
  writeJson(GUEST_CONVERSATIONS_STORAGE_KEY, conversations);

  return {
    user: guestUser,
    contacts: guestContacts,
    conversations,
  };
}

export function getGuestContacts() {
  return guestContacts;
}

export function getGuestMessages(contactId) {
  const messages = readJson(GUEST_MESSAGES_STORAGE_KEY, defaultGuestMessages);
  return messages[contactId] || [];
}

export function addGuestMessage(contactId, message) {
  const messages = readJson(GUEST_MESSAGES_STORAGE_KEY, defaultGuestMessages);
  const normalizedMessage = {
    ...message,
    createdAt: message.createdAt || new Date().toISOString(),
  };
  const nextMessages = {
    ...messages,
    [contactId]: [...(messages[contactId] || []), normalizedMessage],
  };
  writeJson(GUEST_MESSAGES_STORAGE_KEY, nextMessages);
  const conversations = buildGuestConversations(nextMessages);
  writeJson(GUEST_CONVERSATIONS_STORAGE_KEY, conversations);
  return conversations;
}

export function buildGuestConversations(
  messages = readJson(GUEST_MESSAGES_STORAGE_KEY, defaultGuestMessages)
) {
  return Object.entries(messages)
    .map(([contactId, conversationMessages]) => {
      const contact = guestContacts.find((item) => item._id === contactId);
      if (!contact || !conversationMessages.length) {
        return null;
      }

      const lastMessage = conversationMessages[conversationMessages.length - 1];
      return {
        ...contact,
        lastMessage: lastMessage.message,
        updatedAt: lastMessage.createdAt || new Date().toISOString(),
        fromSelf: Boolean(lastMessage.fromSelf),
      };
    })
    .filter(Boolean)
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}

export function getGuestConversations() {
  return readJson(
    GUEST_CONVERSATIONS_STORAGE_KEY,
    buildGuestConversations(defaultGuestMessages)
  );
}

export function buildGuestAutoReply(contactId, outgoingMessage) {
  const contact = guestContacts.find((item) => item._id === contactId);
  const name = contact?.username || "Guest contact";
  return {
    fromSelf: false,
    message: `${name} saw: "${outgoingMessage.slice(0, 40)}"${
      outgoingMessage.length > 40 ? "..." : ""
    }`,
  };
}

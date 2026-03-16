const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

function getAllowedOrigins() {
  const configuredOrigins =
    process.env.CLIENT_ORIGIN ||
    process.env.CLIENT_ORIGINS ||
    process.env.FRONTEND_URL ||
    process.env.FRONTEND_ORIGIN;

  if (!configuredOrigins || configuredOrigins === "*") {
    return "*";
  }

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function createCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (allowedOrigins === "*") {
        return callback(null, true);
      }

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  };
}

const app = express();

app.disable("x-powered-by");
app.use(cors(createCorsOptions()));
app.options("*", cors(createCorsOptions()));
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use((err, _req, res, _next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this request. Check CLIENT_ORIGINS on the backend.",
    });
  }

  console.error("Unhandled application error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = {
  app,
  createCorsOptions,
  getAllowedOrigins,
};

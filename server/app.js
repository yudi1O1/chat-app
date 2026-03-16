const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

function getAllowedOrigins() {
  const configuredOrigins = process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS;

  if (!configuredOrigins) {
    return ["http://localhost:3000"];
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
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use((err, _req, res, _next) => {
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

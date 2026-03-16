const mongoose = require("mongoose");

let connectionPromise;

async function connectToDatabase() {
  if (!process.env.mongo_url) {
    throw new Error("Missing required environment variable: mongo_url");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.mongo_url)
      .then((connection) => {
        console.log("DB connection successful");
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectToDatabase;

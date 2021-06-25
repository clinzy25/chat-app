#!/usr/bin/env node

/* Sets up the environment variables from your .env file*/
require("dotenv").config();

/**
 * Module dependencies.
 */

const { app, sessionStore } = require("../app");
const http = require("http");
const db = require("../db");
const onlineUsers = require("../onlineUsers");
const auth = require("socketio-auth");
const { User } = require("../db/models");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces, and sync database.
 */

const io = require("socket.io")(server);

/**
 * Authenticate socket connection upon login, from thunkCreators
 */

const authenticate = async (socket, data, callback) => {
  const username = data.username;
  try {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    callback(null, user && user.username === username);
  } catch (err) {
    callback(err);
  }
};

io.on("connection", (socket) => {
  socket.on("go-online", (id) => {
    if (!onlineUsers.id) {
      onlineUsers[id] = socket.id;
    }
    // send the user who just went online to everyone else who is already online
    socket.broadcast.emit("add-online-user", id);
  });

  /**
   * Lookup online user with socket id
   */

  socket.on("new-message", (data) => {
    socket.to(onlineUsers[data.recipientId]).emit("new-message", {
      message: data.message,
      sender: data.sender,
      recipient: data.recipientId,
    });
  });

  socket.on("logout", (id) => {
    if (onlineUsers[id]) {
      socket.disconnect();
      delete onlineUsers[id];
    }
  });
  // Uncomment for socket logging
  
  socket.onAny((event, ...args) => {
    console.log(event, args);
    console.log(onlineUsers)
  });
});

auth(io, {
  authenticate,
});

sessionStore
  .sync()
  .then(() => db.sync())
  .then(() => {
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  console.log("Listening on " + bind);
}

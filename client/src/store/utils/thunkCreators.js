import axios from "axios";
// import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";
import io from "socket.io-client";
// import store from "./store";
import { removeOfflineUser, addOnlineUser } from "../conversations";

/**
 * Create socket connection when user logs in or registers
 */

const createSocket = (data, dispatch) => {
  const socket = io(window.location.origin);
  
  let authenticated = false;
  
  socket.on("connect", () => {
    console.log("connected to server");
    socket.emit("authentication", {
      username: data.username,
    });
    
    socket.on("authenticated", () => {
      authenticated = true;
      socket.emit("go-online", data.id);
    });
    
    socket.on("add-online-user", (id) => {
      if (authenticated) {
        dispatch(addOnlineUser(id));
      } else {
        console.log("Invalid user");
      }
    });
    
    socket.on("remove-offline-user", (id) => {
      if (authenticated) {
        dispatch(removeOfflineUser(id));
      } else {
        console.log("User not found");
      }
    });
    
    socket.on("new-message", (data) => {
      if (authenticated) {
        dispatch(setNewMessage(data.message, data.sender, data.recipientId));
      } else {
        console.log("Invalid user");
      }
    });
  });
  
  return socket;
};

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    dispatch(gotUser(data));
    createSocket(data);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    dispatch(gotUser(data));
    createSocket(data);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    dispatch(gotUser({}));
    createSocket(id).emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

export const updateReadStatus = (body) => async (dispatch) => {
  try {
    const data = await axios.put("/api/conversationsPost", body);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  try {
    const { data } = await axios.post("/api/messages", body);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = (data, body) => {
  createSocket(data).emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);
    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
      sendMessage(data, body);
    } else {
      dispatch(setNewMessage(data.message));
      sendMessage(data, body);
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

import api from "../../api";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await api.get("/auth/user");
    dispatch(gotUser(data));
    socket.emit('authentication', {
      data,
    })
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await api.post("/auth/register", credentials);
    dispatch(gotUser(data));
    window.location.reload();
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    dispatch(gotUser(data));
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await api.delete("/auth/logout");
    dispatch(gotUser({}));
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = (user) => async (dispatch) => {
  try {
    const { data } = await api.get("/api/conversations", user);
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param {*} body
 * @returns
 */
export const updateReadStatus = (body) => async (dispatch) => {
  try {
    const data = await api.put("/api/conversationsPost", body);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  try {
    const { data } = await api.post("/api/messages", body);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
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
    const { data } = await api.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

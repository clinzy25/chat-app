import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  socket.emit("authentication", {
    username: store.getState().user.username,
  });
  socket.on("authenticated", () => {
    console.log("connected to server");
    socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
    });
    socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
    });
    socket.on("new-message", (data) => {
      store.dispatch(
        setNewMessage(data.message, data.sender, data.recipientId)
      );
    });
  });
});

export default socket;

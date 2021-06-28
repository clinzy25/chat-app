const clone = require("rfdc")();

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  const newState = clone(state);
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message]
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...newState];
  }

  return newState.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = clone(convo);
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = clone(convo);
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = clone(convo);
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = clone(state);
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = clone(convo);
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const setReadMessages = (state, conversationId) => {
  const newState = state.map((convo) => {
    if (convo.id === conversationId) {
      const newMessages = convo.messages.map((msg) => {
        if (msg.senderId === convo.otherUser.id) {
          const newMsg = clone(msg);
          newMsg.read = true;
          return newMsg;
        } else {
          return msg;
        }
      });
      return { ...convo, messages: newMessages };
    } else {
      return convo;
    }
  });
  return newState;
};

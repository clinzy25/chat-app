const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (username) => {
  return {
    type: SET_ACTIVE_CHAT,
    username
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      localStorage.removeItem(`${action.username}_unread_messages`);
      return action.username;
    }
    default:
      return state;
  }
};

export default reducer;

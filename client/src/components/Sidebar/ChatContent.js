import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  notification: {
    height: 20,
    width: 20,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  unread: {
    backgroundColor: "dodgerblue",
    minWidth: "30px",
    height: "min-content",
    marginRight: "20px",
    padding: "5px",
    borderRadius: "100%",
    textAlign: "center",
    fontWeight: "900",
    color: "white",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  const [unreadMessages, setUnreadMessages] = useState(null);

  const getNumUnreadMessages = useCallback(() => {
    let unreadMessages = 0;
    conversation.messages.forEach((msg) => {
      if (msg.read === false && msg.senderId === otherUser.id) {
        unreadMessages++;
      }
    });
    return unreadMessages === 0
      ? setUnreadMessages(null)
      : setUnreadMessages(unreadMessages);
  }, [conversation.messages, otherUser]);

  useEffect(() => {
    getNumUnreadMessages();
  }, [getNumUnreadMessages]);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unreadMessages && <Box className={classes.unread}>{unreadMessages}</Box>}
    </Box>
  );
};

export default ChatContent;

import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  msgContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  readAvatar: {
    height: "15px",
    width: "15px",
    alignSelf: "flex-end",
  },
}));

const Messages = ({ messages, otherUser, userId }) => {
  const classes = useStyles();

  const [lastReadMessage, setLastReadMessage] = useState(null);

  const getLastReadMessage = useCallback(() => {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].read === true && messages[i].senderId === userId) {
        setLastReadMessage(messages[i]);
      }
    }
  }, [messages, userId]);

  useEffect(() => {
    getLastReadMessage();
  }, [messages, getLastReadMessage]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <div className={classes.msgContainer}>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {lastReadMessage?.id === message.id && (
              <Avatar
                alt={otherUser.username}
                src={otherUser.photoUrl}
                className={classes.readAvatar}
              ></Avatar>
            )}
          </div>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;

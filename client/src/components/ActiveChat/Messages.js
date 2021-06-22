import React from "react";
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

const Messages = (props) => {
  const classes = useStyles();

  const { messages, otherUser, userId } = props;

  const getLastReadMessage = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].read === true && messages[i].senderId === userId) {
        return messages[i];
      }
    }
  };

  const lastReadMessage = getLastReadMessage();

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <div className={classes.msgContainer}>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {lastReadMessage && lastReadMessage.id === message.id && (
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

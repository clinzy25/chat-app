import React, { useState } from 'react'
import { FormControl, FilledInput } from '@material-ui/core'
import { postMessage } from '../../store/utils/thunkCreators'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: 'flex-end',
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: '#F4F6FA',
    borderRadius: 8,
    marginBottom: 20,
  },
}))

const Input = ({ otherUser, conversationId, user }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const [text, setText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId: conversationId,
      sender: conversationId ? null : user,
      read: false,
    }
    dispatch(postMessage(reqBody))
    setText('')
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={(e) => setText(e.target.value)}
        />
      </FormControl>
    </form>
  )
}

export default Input

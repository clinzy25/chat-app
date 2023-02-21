import io from 'socket.io-client'
import { baseURL } from './api'
import store from './store'
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from './store/conversations'

const socket = io(baseURL, { transports: ['websocket', 'polling'] })

let authenticated = false

socket.on('connect', () => {
  console.log('Connected to websocket server')
  socket.emit('authentication', {
    username: store.getState().user.username,
  })
  socket.on('authenticated', () => {
    authenticated = true
    socket.emit('go-online', store.getState().user.id)
  })

  socket.on('add-online-user', (id) => {
    if (authenticated) {
      store.dispatch(addOnlineUser(id))
    } else {
      console.log('Invalid user')
    }
  })

  socket.on('remove-offline-user', (id) => {
    if (authenticated) {
      store.dispatch(removeOfflineUser(id))
    } else {
      console.log('User not found')
    }
  })

  socket.on('new-message', (data) => {
    if (authenticated) {
      store.dispatch(setNewMessage(data.message, data.sender, data.recipientId))
    } else {
      console.log('Invalid user')
    }
  })
})

export default socket

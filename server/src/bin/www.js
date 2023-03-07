const { app, sessionStore } = require('../app')
const http = require('http')
const db = require('../db')
const onlineUsers = require('../onlineUsers')
const auth = require('socketio-auth')
const { User } = require('../db/models')
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

const port = normalizePort(process.env.PORT || '8080')
app.set('port', port)

const server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: {
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://chat01.link',
    ],
  },
  transports: ['websocket', 'polling'],
})

io.on('connection', (socket) => {
  socket.on('go-online', (id) => {
    if (!onlineUsers.id) {
      onlineUsers[id] = socket.id
    }
    socket.broadcast.emit('add-online-user', id)
  })

  socket.on('new-message', (data) => {
    socket.to(onlineUsers[data.recipientId]).emit('new-message', {
      message: data.message,
      sender: data.sender,
      recipient: data.recipientId,
    })
  })

  socket.on('logout', (id) => {
    if (onlineUsers[id]) {
      socket.disconnect()
      delete onlineUsers[id]
    }
  })
})

const authenticate = async (socket, data, callback) => {
  const username = data.username
  try {
    const user = await User.findOne({
      where: {
        username: username,
      },
    })
    callback(null, user && user.username === username)
  } catch (err) {
    callback(err)
  }
}

auth(io, {
  authenticate,
})

sessionStore
  .sync()
  .then(() => db.sync())
  .then(() => {
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
  })

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port

  console.log('Listening on ' + bind)
}

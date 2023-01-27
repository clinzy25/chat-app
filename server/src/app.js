const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const cors = require('cors')
const { User } = require('./db/models')
const sessionStore = new SequelizeStore({ db })
const cookieParser = require('cookie-parser')
const { json, urlencoded } = express

const app = express()

function checkToken(req, res, next) {
  const token = req.cookies.token
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next()
      }
      User.findOne({
        where: { id: decoded.id },
      }).then((user) => {
        req.user = user
        return next()
      })
    })
  } else {
    return next()
  }
}

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'build')))
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4200'],
  })
)
app.use(checkToken)

app.use('/auth', require('./routes/auth'))
app.use('/api', require('./routes/api'))
app.get('/*', (req, res) => res.json({ status: 'Lookin goood' }))

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error =
    req.app.get('env') === 'development' ? console.log(err) : {}

  res.status(err.status || 500)
  res.json({ error: err })
})

module.exports = { app, sessionStore }

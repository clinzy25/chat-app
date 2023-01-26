const router = require('express').Router()
const { Message } = require('../../db/models')

router.put('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401)
    }
    const { conversation, otherUserId } = req.body
    const messages = await Message.update(
      { read: true },
      {
        where: {
          conversationId: conversation || null,
          senderId: otherUserId,
        },
      }
    )
    res.json(messages)
  } catch (error) {
    next(error)
  }
})

module.exports = router

const express = require('express')
const router = express.Router()

const message = require('../controllers/message')

router.get('/messages', message.all)

module.exports = router
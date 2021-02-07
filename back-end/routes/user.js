const express = require('express')
const router = express.Router()

const user = require('../controllers/user')

// router.get('/signup', user.signup)
router.post('/signup', user.signup)


module.exports = router
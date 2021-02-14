const express = require('express')
const router = express.Router()

const user = require('../controllers/user')

router.post('/signup', user.signup)
router.post('/login', user.login)
router.get('/user/:id', user.get)


module.exports = router
const express = require('express')
const router = express.Router()
const {body} = require('express-validator');

const message = require('../controllers/message')
const multer = require('multer')
const multerStorage = require('../middlewares/multerStorage')
const User = require("../models/User");
const upload = multer({storage: multerStorage})

router.get('/messages', message.all)

router.post('/message',
    upload.single('file'),
    body('date').isDate({format: "YYYY-MM-DD HH:mm:ss"}),
    body('userId').custom(async value => {
        return await (new User()).findById(value).then(user => {
            if (!user) {
                return Promise.reject(`L'utilisateur #${value} est inconnue`);
            }
        });
    }),
    body('content').not().isEmpty().trim().escape(),
    message.post)

module.exports = router
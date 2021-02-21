const Message = require('../models/Message')

exports.all = async (req, res) => {
    const messages = await (new Message()).all()
    return res.status(200).json(messages)
}
const Message = require('../models/Message')

exports.all = async (req, res) => {
    const messages = await (new Message()).all()
    return res.status(200).json(messages)
}

exports.delete = async (req, res) => {
    let id = req.params.id
    if (id) {
        const getMessage = await (new Message()).exist(id)
        if (getMessage) {
            await (new Message()).delete(id)
        } else {
            res.status(400).json({error: `L'id ${id} ne correspond à aucun message`})
        }
    }
}
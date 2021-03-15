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

exports.post = async (req, res) => {
    const file = req.file
    const message = req.body

        try {
            let insert = await (new Message()).insert({
                userID: message.userId,
                date: message.date,
                content: message.content,
                image: file.filename
            })

            io.emit("newMessage.file", {
                id: insert.insertId,
                content: message.content,
                date: message.date,
                user: {
                    id: message.userId,
                    pseudo: message.pseudo
                }
            })

            console.log(insert.insertId)

            return res.status(200).json({success: true})
        } catch (error) {
            return res.status(400).json({error})
        }
}
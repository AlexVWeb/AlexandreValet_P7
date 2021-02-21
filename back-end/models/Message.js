const {pool} = require('./sql_connect')

class Message {
    constructor() {
        this.tableName = 'messages'
    }

    async createTable() {
        //@formatter:off
        let createTable = `
        CREATE TABLE IF NOT EXISTS messages (
            id int PRIMARY KEY AUTO_INCREMENT,
            user_id int NOT NULL,
            date datetime NOT NULL,
            content text
        );`
        //@formatter:on
        await pool.query(createTable, (err) => {
            if (err) console.log(err.message)
        })
    }

    insert({userID, date, content}) {
        let value = [userID, date, content]
        return pool.query(`INSERT INTO ${this.tableName}(user_id, date, content) VALUE (?, ?, ?)`, value)
            .then(r => {
                return r
            })
            .catch(error => console.error(error))
    }

    async all() {
        try {
            return await pool.query(`SELECT * FROM ${this.tableName}`)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Message
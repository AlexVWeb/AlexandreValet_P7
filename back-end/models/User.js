const {pool} = require('./sql_connect')
const CryptoJS = require("crypto-js");

class User {
    constructor() {
    }

    insert({email, pseudo, password}) {
        const roles = JSON.stringify(['ROLE_MEMBER'])
        let value = [email, pseudo, password, roles]
        return pool.query('INSERT INTO users(email, pseudo, password, roles) VALUE (?, ?, ?, ?)', value)
            .then()
            .catch(error => console.error(error))
    }

    async createTable() {
        //@formatter:off
        let createTable = `
        CREATE TABLE IF NOT EXISTS users (
         id int PRIMARY KEY AUTO_INCREMENT,
         email varchar(255) not null,
         pseudo varchar(255) not null,
         password varchar(255) not null,
         roles json,
         token_remember varchar(255),
         created_at timestamp not null,
         updated_at timestamp
        );`
        //@formatter:on
        await pool.query(createTable, (err) => {
            if (err) console.log(err.message)
        })
    }

    async findById(id) {
        const [row] = await pool.query(`SELECT * FROM users WHERE id = ${id} LIMIT 1`)
        return row || null
    }

    async findByEmail(email) {
        let getUsers = await pool.query('SELECT * FROM users')
        return getUsers.find((user) => {
            let email_user = CryptoJS.AES.decrypt(user.email, process.env.MASK_TOKEN);
            let emailDecrypt = email_user.toString(CryptoJS.enc.Utf8);
            if (email === emailDecrypt) {
                return user
            } else {
                return false
            }
        })
    }
}

module.exports = User
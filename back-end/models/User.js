const {pool} = require('./sql_connect')
const CryptoJS = require("crypto-js");

exports.insertUser = async (email, pseudo, password) => {
    const roles = JSON.stringify([])
    let value = [email, pseudo, password, roles]
    return pool.query('INSERT INTO users(email, pseudo, password, roles) VALUE (?, ?, ?, ?)', value)
        .then()
        .catch(error => console.error(error))
}

exports.createUserTable = async () => {
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

    await pool.query(createTable, (err) => {
        if (err) console.log(err.message)
    })
}

exports.findUserByEmail = async (email) => {
    let getUsers = await pool.query('SELECT * FROM users')
    return getUsers.find((user) => {
        let email_user = CryptoJS.AES.decrypt(user.email, process.env.MASK_TOKEN);
        let emailDecrypt = email_user.toString(CryptoJS.enc.Utf8);
        return email === emailDecrypt
    })
}
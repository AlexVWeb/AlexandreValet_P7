const bcrypt = require('bcrypt')
const passwordValidator = require('password-validator')
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.signup = async (req, res) => {
    await (new User()).createTable()
    let email = req.body.email
    let email_check = req.body.email_check
    let pseudo = req.body.pseudo
    let password = req.body.password
    let password_check = req.body.password_check

    if (email !== email_check) return res.status(400).json({message: "Les 2 adresse mails ne sont pas identique"})
    if (!fieldIsDefined(email)) return res.status(400).json({message: "Aucun email renseigné"})
    if (!emailIsValid(email)) return res.status(400).json({message: "l'adresse email n'est pas valide"})
    if (!fieldIsDefined(pseudo)) return res.status(400).json({message: "Aucun pseudo renseigné"})
    if (password !== password_check) return res.status(400).json({message: "Les 2 mots de passe ne sont pas identique"})
    if (!fieldIsDefined(password)) return res.status(400).json({message: "Aucun mot de passe renseigné"})

    const user = await (new User()).findByEmail(email)
    if (!user) {
        const schemaPassword = new passwordValidator()
        schemaPassword
            .is().min(5)
            .has().uppercase()
            .has().lowercase()
            .has().digits(2)
            .has().letters(2)
            .has().not().spaces()
        if (schemaPassword.validate(password)) {
            try {
                const hash_password = await bcrypt.hash(password, 10)
                const hash_email = CryptoJS.AES.encrypt(email, process.env.MASK_TOKEN).toString()
                try {
                    await (new User()).insert({
                        email: hash_email,
                        pseudo,
                        password: hash_password
                    })
                    return res.status(201).json({message: 'Inscription réussie'})
                } catch (error) {
                    return res.status(400).json({error})
                }
            } catch (error) {
                return res.status(500).json({error})
            }
        } else {
            let passwordErrors = schemaPassword.validate(password, {list: true})
            return res.status(400).json(passwordErrors)
        }
    } else {
        return res.status(400).json({error: "Cet utilisateur existe déja"})
    }
}

exports.login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await (new User()).findByEmail(email)
    if (user) {
        try {
            const valid = await bcrypt.compare(password, user.password)
            if (!valid) {
                return res.status(401).json({error: 'Identifiant ou mot de passe incorrect'})
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    pseudo: user.pseudo
                },
                process.env.JWT_TOKEN,
                {expiresIn: '24h'}
            )

            return res.status(200).json({
                userId: user.id,
                token: token,
                message: 'Connexion avec succès',
                success: true
            })
        } catch (e) {
        }
    } else {
        return res.status(401).json({error: 'Identifiant ou mot de passe incorrect'})
    }
}

exports.get = async (req, res) => {
    const id = req.params.id
    let user = await (new User()).findById(id)
    if (user) {
        delete user.email
        delete user.password
        delete user.roles
        delete user.token_remember
        delete user.created_at
        delete user.updated_at
        return res.status(200).json(user)
    }
    return res.status(404).json({error: 'Aucun utilisateur trouvé'})
}

exports.getAll = async (req, res) => {
    let users = await (new User().findAll())
    return res.status(200).json(users)
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fieldIsDefined(field) {
    return !(field === '' || field === undefined);
}
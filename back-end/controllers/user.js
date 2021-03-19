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
            .has().not().spaces()
        if (schemaPassword.validate(password)) {
            try {
                const hash_password = await bcrypt.hash(password, 10)
                const hash_email = encodeEmail(email)
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
    let user = await (new User()).findByEmail(email)
    if (user) {
        try {
            const valid = await bcrypt.compare(password, user.password)
            if (!valid) {
                return res.status(401).json({error: 'Identifiant ou mot de passe incorrect'})
            }
            user = purgePublicUser(user)
            const token = jwt.sign(
                {
                    userId: user.id,
                    pseudo: user.pseudo,
                    role: user.roles
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
        user = purgePublicUser(user)
        return res.status(200).json(user)
    }
    return res.status(404).json({error: 'Aucun utilisateur trouvé'})
}

exports.getAll = async (req, res) => {
    let users = await (new User().findAll())
    return res.status(200).json(users)
}

exports.update = async (req, res) => {
    let token = jwt.decode(req.body.token)
    let user = jwt.decode(req.body.data).setUser
    if (token.userId !== user.id) {
        return res.status(400).json("L'ID de l'utilisateur n'est pas correct")
    }
    let getUser = await (new User()).findById(user.id)

    console.log(user)

    let errors = []
    let changes = []
    // Vérification de l'existance des champs
    if (user.email !== undefined && emailIsValid(user.email)) {
        let emailExist = await (new User()).findByEmail(user.email)
        if (!emailExist) {
            await User.updateOne(user.id, 'email', encodeEmail(user.email))
            changes.push({'email': true})
        } else {
            errors.push("Cet utilisateur existe déja")
        }
    }

    if (user.pseudo !== undefined) {
        let pseudoExist = await (new User()).findByPseudo(user.pseudo)
        if (pseudoExist) {
            errors.push("Ce pseudo est déjà utlisé")
        } else {
            if (user.pseudo !== getUser.pseudo) {
                await User.updateOne(user.id, 'pseudo', user.pseudo)
                changes.push({'pseudo': user.pseudo})
            } else {
                errors.push("Ce pseudo est déja le votre")
            }
        }
    }

    if (user.password !== undefined && user.checkPassword === undefined) {
        errors.push("Veuillez répétez votre mot de passe")
    }

    if (user.password !== undefined) {
        if (user.password === user.checkPassword) {
            if (passwordIsValid(user.password)) {
                const hash_password = await bcrypt.hash(user.password, 10)
                await User.updateOne(user.id, 'password', hash_password)
                changes.push({'password': true})
            } else {
                errors.push("Le mot de passe n'est pas suffisament sécurisé")
            }
        } else {
            errors.push("Les mots de passe ne correspondent pas")
        }
    }

    if (errors.length !== 0) {
        return res.status(400).json({errors})
    } else {
        return res.status(200).json(changes)
    }
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fieldIsDefined(field) {
    return !(field === '' || field === undefined);
}

function purgePublicUser(user) {
    delete user.email
    delete user.password
    delete user.token_remember
    delete user.created_at
    delete user.updated_at
    let roles = JSON.parse(user.roles)
    user.roles = roles.toString()
    return user
}

function encodeEmail(email) {
    return CryptoJS.AES.encrypt(email, process.env.MASK_TOKEN).toString()
}

function decodeEmail(emailEncode) {
    let bytes = CryptoJS.AES.decrypt(emailEncode, process.env.MASK_TOKEN)
    return bytes.toString(CryptoJS.enc.Utf8)
}

function passwordIsValid(password) {
    const schemaPassword = new passwordValidator()
    schemaPassword
        .is().min(5)
        .has().uppercase()
        .has().lowercase()
        .has().not().spaces()
    return !!schemaPassword.validate(password);
}

exports.purgePublicUser = (user) => {
    return purgePublicUser(user)
}

exports.decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_TOKEN)
}
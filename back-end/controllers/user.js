const bcrypt = require('bcrypt')
const passwordValidator = require('password-validator')
const CryptoJS = require("crypto-js");
const {createUserTable, insertUser, findUserByEmail} = require('../models/User')


exports.signup = async (req, res) => {
    await createUserTable()
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

    const user = await findUserByEmail(email)
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
                    insertUser(hash_email, pseudo, hash_password).then(r => console.log(r))
                    return res.status(201).json({message: 'Votre compte à été créer avec succès'})
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
        return res.status(400).json({error: "Un compte existe déja"})
    }
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fieldIsDefined(field) {
    return !(field === '' || field === undefined);
}
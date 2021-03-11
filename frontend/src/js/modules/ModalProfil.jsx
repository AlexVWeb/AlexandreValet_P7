import React, {useState, createRef} from "react";
import User from "../Class/User";
import jwt from "jsonwebtoken"
import ValidationForm from "../Class/ValidationForm";

export const ModalProfil = () => {
    const currentUser = User.getCurrentUser()
    const [email, setEmail] = useState('')
    const [pseudo, setPseudo] = useState(currentUser.pseudo)
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')

    let emailRef = createRef()
    let pseudoRef = createRef()
    let passwordRef = createRef()
    let checkPasswordRef = createRef()

    const onEmail = (e) => {
        setEmail(e.target.value)
        ValidationForm.fieldClearRender(emailRef.current)
    }

    const onPseudo = (e) => {
        setPseudo(e.target.value)
    }
    const onPassword = (e) => {
        setPassword(e.target.value)
    }
    const onCheckPassword = (e) => {
        setCheckPassword(e.target.value)
        ValidationForm.fieldClearRender(checkPasswordRef.current)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const currentUserID = currentUser.userId
        let token = User.getToken()

        let setUser = {}
        let errors = false
        if (email !== '') {
            if (ValidationForm.emailIsValid(email)) {
                setUser = {...setUser, email}
            } else {
                ValidationForm.renderInvalidField(emailRef.current, "L'adresse email n'est pas valide")
                errors = true
            }
        }

        // TODO: reactualiser le token avec le nouveau pseudo
        if (pseudo !== '' && pseudo !== currentUser.pseudo) setUser = {...setUser, pseudo}

        if (password !== '') setUser = {...setUser, password}
        if (checkPassword !== '') setUser = {...setUser, checkPassword}

        if (password !== '' && checkPassword === '') {
            ValidationForm.renderInvalidField(checkPasswordRef.current, 'Veuillez répétez votre mot de passe')
            errors = true
        }

        if ((password !== '' && checkPassword !== '') && password !== checkPassword) {
            ValidationForm.renderInvalidField(checkPasswordRef.current, 'Les mots de passe ne correspondent pas')
            errors = true
        }

        if (!errors) {
            // Vérifie si setUser n'est pas vide et est bien un objet
            if (Object.entries(setUser).length > 0 && setUser.constructor === Object) {
                setUser = {id: currentUserID, ...setUser}
                let respRequest = await fetch(`${process.env.API_URL}/api/user/${currentUserID}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        token,
                        data: jwt.sign(
                            {
                                setUser
                            },
                            process.env.JWT_TOKEN,
                            {expiresIn: '24h'})
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                let respJSON = await respRequest.json()
                if (!respRequest.ok && respJSON.errors.length > 0) {
                    let respErrors = respJSON.errors
                    respErrors.forEach((error) => {
                        console.log(error)
                    })
                } else {
                    console.log(respJSON)
                }
            }
        }
    }
    return <>
        <form onSubmit={onSubmit} method={"POST"}>
            <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="emailProfil" className="form-label">Adresse email</label>
                    <input ref={emailRef} onChange={onEmail} type="email" className="form-control" id="emailProfil"
                           placeholder="name@example.com" value={email}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="pseudoProfil" className="form-label">Pseudo</label>
                    <input ref={pseudoRef} onChange={onPseudo} type="text" className="form-control" id="pseudoProfil"
                           value={pseudo}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="passwordProfil" className="form-label">Mot de passe</label>
                    <input ref={passwordRef} onChange={onPassword} type="password" className="form-control"
                           id="passwordProfil" value={password}/>
                    <small className="">Doit contenir 5 caractères alphanumérique dont 1 majuscule, 1
                        minuscule</small>
                </div>
                <div className="mb-3">
                    <label htmlFor="repeatPasswordProfil" className="form-label">Répétez le mot de
                        passe</label>
                    <input ref={checkPasswordRef} onChange={onCheckPassword} type="password" className="form-control"
                           id="repeatPasswordProfil" value={checkPassword}/>
                </div>
            </div>

            <div className="modal-footer">
                <button className="btn btn-primary">Sauvegarder</button>
            </div>
        </form>
    </>
}
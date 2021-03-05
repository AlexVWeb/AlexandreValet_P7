import React, {useState} from "react";
import User from "../controllers/user";
import jwt from "jsonwebtoken"

export const ModalProfil = () => {
    const currentUser = (new User()).getCurrentUser()
    const [email, setEmail] = useState('')
    const [pseudo, setPseudo] = useState(currentUser.pseudo)
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')

    const onEmail = (e) => {
        setEmail(e.target.value)
    }
    const onPseudo = (e) => {
        setPseudo(e.target.value)
    }
    const onPassword = (e) => {
        setPassword(e.target.value)
    }
    const onCheckPassword = (e) => {
        setCheckPassword(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const currentUserID = currentUser.userId
        let token = (new User()).getToken()

        let setUser = {id: currentUserID}
        if (email !== '') {
            setUser = {...setUser, email}
        }
        if (pseudo !== '' && pseudo !== currentUser.pseudo) {
            setUser = {...setUser, pseudo}
        }
        if (password !== '') {
            setUser = {...setUser, password}
        }
        if (checkPassword !== '') {
            setUser = {...setUser, checkPassword}
        }

        fetch(`${process.env.API_URL}/api/user/${currentUserID}`, {
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
            .then((response) => console.log(response))
    }
    return <>
        <div className="modal fade" id="modalAccount" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Éditer mon profil</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onSubmit} method={"POST"} id={"accountForm"}>
                            <div className="mb-3">
                                <label htmlFor="emailProfil" className="form-label">Adresse email</label>
                                <input onChange={onEmail} type="email" className="form-control" id="emailProfil"
                                       placeholder="name@example.com"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="pseudoProfil" className="form-label">Pseudo</label>
                                <input onChange={onPseudo} type="text" className="form-control" id="pseudoProfil"
                                       value={pseudo}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passwordProfil" className="form-label">Mot de passe</label>
                                <input onChange={onPassword} type="password" className="form-control"
                                       id="passwordProfil"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="repeatPasswordProfil" className="form-label">Répétez le mot de
                                    passe</label>
                                <input onChange={onCheckPassword} type="password" className="form-control"
                                       id="repeatPasswordProfil"/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button form="accountForm" className="btn btn-primary">Sauvegarder</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}
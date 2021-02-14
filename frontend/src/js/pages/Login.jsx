import React, {useState} from "react"
import {notification, setCookie} from "../utils";
import User from "../controllers/user"

export default function Login() {
    const [email, setEmail] = useState('test@test.fr')
    const [password, setPassword] = useState('Test69480!')

    const resetForm = () => {
        setEmail('')
        setPassword('')
    }

    const _onSubmit = async function (e) {
        e.preventDefault()
        let form = document.querySelector('#login_form')
        let btn_submit = form.querySelector("button")
        btn_submit.disabled = true
        try {
            const response = await (new User()).signIn({email, password})

            const notif = notification()
            if (response.success) {
                resetForm()
                setCookie('token', response.token, {expire: 1})
                await notif.fire({
                    icon: 'success',
                    title: response.message,
                    didOpen(popup) {
                        setTimeout(() => {
                            document.location.replace('/messagerie')
                        }, 1000)
                    }
                })
            } else {
                btn_submit.disabled = false
                await notif.fire({
                    icon: 'error',
                    title: response.error
                })
            }
        } catch (e) {
            btn_submit.disabled = false
        }
    }

    return <>
        <div className="container-fluid container_login" onSubmit={_onSubmit} id="login_form">
            <form className="login_form">
                <h1>Se connecter</h1>
                <hr/>
                <div className="mb-3">
                    <label htmlFor="login_email" className="form-label">Adresse email</label>
                    <input type="email" className="form-control" id="login_email"
                           placeholder="name@example.com"
                           onChange={(e) => setEmail(e.target.value)}
                           value={email}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="login_password" className="form-label">Mot de passe</label>
                    <input type="password" className="form-control" id="login_password"
                           placeholder=""
                           onChange={(e) => setPassword(e.target.value)}
                           value={password}
                    />
                </div>
                <button type={"submit"} className={"btn btn-success w-100"}>Se connecter</button>
                <a className='text-white mt-2' href="">Mot de passe oublié</a>
            </form>
        </div>
    </>

}
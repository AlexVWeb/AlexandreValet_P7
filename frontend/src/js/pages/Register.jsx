import React, {useEffect, useState} from "react"
import Swal from 'sweetalert2'

export default function Register() {
    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [confirm_email, setConfirmEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')

    const _onSubmit = async function (e) {
        e.preventDefault()
        let form = document.querySelector('#login_form')
        let btn_submit = form.querySelector("button")
        btn_submit.disabled = true
        try {

            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pseudo: pseudo,
                    email: email,
                    email_check: confirm_email,
                    password: password,
                    password_check: confirm_password
                })
            })

            const data = await response.json()
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            if (response.ok) {
                await Toast.fire({
                    icon: 'success',
                    title: data.message,
                    didClose() {
                        setTimeout(() => {
                            document.location.replace('/login')
                        }, 0)
                    }
                })
                form.reset()
            } else {
                btn_submit.disabled = false
                await Toast.fire({
                    icon: 'error',
                    title: data.error
                })
            }
        } catch (e) {
        }
    }


    return <>
        <div className="container-fluid container_login">
            <form className="login_form" id="login_form" onSubmit={_onSubmit}>
                <h1>Inscription</h1>
                <hr/>
                <div className="mb-3">
                    <label htmlFor="register__username" className="form-label">Pseudo</label>
                    <input type="text" className="form-control" id="register__username"
                           value={pseudo}
                           onChange={(e) => setPseudo(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="register__email" className="form-label">Adresse email</label>
                    <input type="email" className="form-control" id="register__email"
                           placeholder="name@example.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="register__confirm_email" className="form-label">Confirmez votre adresse
                        email</label>
                    <input type="email" className="form-control" id="register__confirm_email"
                           placeholder="name@example.com"
                           value={confirm_email}
                           onChange={(e) => setConfirmEmail(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="register__password" className="form-label">Mot de passe</label>
                    <input type="password" className="form-control" id="register__password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="register__confirm_password" className="form-label">Répétez votre mot de
                        passe</label>
                    <input type="password" className="form-control" id="register__confirm_password"
                           value={confirm_password}
                           onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                <button type={"submit"} className={"btn btn-success w-100"}>S'inscrire</button>
            </form>
        </div>
    </>
}
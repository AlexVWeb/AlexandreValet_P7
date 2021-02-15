import {getCookie} from "../utils";
import jwt from "jsonwebtoken"

class User {
    constructor() {
    }

    getCurrentUser() {
        let token = getCookie('token')
        if (token) {
            try {
                let token_verify = jwt.verify(token, process.env.JWT_TOKEN)
                if (token_verify) {
                    return token_verify
                }
            } catch (e) {

            }
        }

        return false
    }

    isConnect(id = null) {
        let isConnect = false
        let token = getCookie('token')
        if (token) {
            try {
                let token_verify = jwt.verify(token, process.env.JWT_TOKEN)
                if (token_verify) {
                    isConnect = true
                }
            } catch (e) {

            }
        }

        return isConnect
    }

    async signIn({email, password}) {
        const response = await fetch(`${process.env.API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        return await response.json()
    }
}

export default User
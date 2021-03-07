import React, {useEffect, useState} from "react";
import User from "./User";
import UserController from "../controllers/user";
import socketIOClient from "socket.io-client";
import {getCookie, setCookie} from "../utils";
import jwt from "jsonwebtoken"

const ENDPOINT = process.env.API_URL;
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})
export default function Sidebar() {
    const [members, setMembers] = useState([])
    io.on('user.newRole', ({id, role}) => {
        let token = UserController.getCurrentUser()
        if (token.userId === id) {
            const newToken = jwt.sign(
                {
                    userId: token.userId,
                    pseudo: token.pseudo,
                    role: role
                },
                process.env.JWT_TOKEN,
                {expiresIn: '24h'}
            )
            setCookie('token', newToken)
            onChangeRole(role, id)
        }
    })

    useEffect(() => {
        async function effect() {
            let token = getCookie('token')
            io.emit('login', token)
            let listUsersReq = await fetch(`${process.env.API_URL}/api/users`)
            let listUsers = await listUsersReq.json()
            setMembers(listUsers)
        }

        effect()
    }, [])

    const onChangeRole = (role, id) => {
        setMembers(members.map(member => member.id === id ? {...member, roles: role} : member))
    }

    return <>
        <div className={'sidebar'}>
            <div className="sidebar__heading">
                <p>Administrateurs</p>
            </div>
            <div className="sidebar__users">
                {
                    members.map((user, key) => {
                        return user.roles === 'ROLE_ADMIN' ?
                            <User key={key} pseudo={user.pseudo} id={user.id} role={user.roles}
                                  changeRole={onChangeRole}/> : ''
                    })
                }
            </div>

            <div className="sidebar__heading">
                <p>Membres</p>
            </div>
            <div className="sidebar__users">
                {
                    members.map((user, key) => {
                        return user.roles === 'ROLE_MEMBER' ?
                            <User key={key} pseudo={user.pseudo} id={user.id} role={user.roles}
                                  changeRole={onChangeRole}/> : ''
                    })
                }
            </div>
        </div>
    </>
}
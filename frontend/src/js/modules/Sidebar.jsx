import React, {useEffect, useState} from "react";
import User from "./User";
import socketIOClient from "socket.io-client";
import {getCookie} from "../utils";

const ENDPOINT = process.env.API_URL;
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})
export default function Sidebar() {
    const [members, setMembers] = useState([])
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
    return <>
        <div className={'sidebar'}>
            <div className="sidebar__heading">
                <p>Administrateurs</p>
            </div>
            <div className="sidebar__users">
                {
                    members.map((user, key) => {
                        return user.roles === 'ROLE_ADMIN' ?
                            <User key={key} pseudo={user.pseudo} id={user.id} role={user.roles}/> : ''
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
                            <User key={key} pseudo={user.pseudo} id={user.id} role={user.roles}/> : ''
                    })
                }
            </div>
        </div>
    </>
}
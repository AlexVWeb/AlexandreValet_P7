import React, {useEffect, useState, forwardRef} from "react";
import User from "./User";
import UserController from "../Class/User";
import socketIOClient from "socket.io-client";
import {getCookie, setCookie} from "../utils";
import jwt from "jsonwebtoken"

const ENDPOINT = process.env.API_URL;
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})

export const Sidebar = forwardRef(({}, ref) => {
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

    const onChangeRole = (role, id) => {
        setMembers(members.map(member => member.id === id ? {...member, roles: role} : member))
    }

    const _closeSidenav = () => {
        let modalSidebar = ref.current
        let sidebar = ref.current.querySelector('.sidenav')
        sidebar.style.width = "0";
        modalSidebar.style.visibility = 'hidden';
        modalSidebar.style.opacity = '0';
        modalSidebar.style.transition = 'visibility 0.2s linear, opacity 0.2s linear';
        sidebar.style.transition = 'width 0.5s';
    }

    const _dismissModal = (e) => {
        if (e.target === ref.current) {
            _closeSidenav()
        }
    }

    window.addEventListener('click', _dismissModal)

    return <>
        <div id="modal__sidebar" ref={ref}>
            <div id="mySidenav" className="sidenav">
                <a onClick={_closeSidenav} className="closeBtn">&times;</a>
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
        </div>
    </>
})
import React, {} from "react"
import User from "../controllers/user";
import socketIOClient from "socket.io-client";

const ENDPOINT = process.env.API_URL;
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})

export default function Message({avatar, date, content, id, user: {id: userId, pseudo}}) {
    let currentUser = (new User).getCurrentUser()

    let userIsAuthorized = false
    if ((currentUser.role === "ROLE_MEMBER" && currentUser.userId === userId) ||
        currentUser.role === "ROLE_ADMIN") {
        userIsAuthorized = true
    }

    const _onDeleteMessage = (e) => {
        e.preventDefault()
        if (userIsAuthorized && confirm("Voulez vous vraiment supprimer le message ?")) {
            io.emit('message.delete', {id, currentUser})
        }
    }

    return <>
        <div className="message">
            <img className="message__avatar"
                 src={avatar}
                 alt={"avatar de " + pseudo}/>
            <div>
                <div className={"message__header"}>
                    <p className={"message__pseudo"}>{pseudo}</p>
                    <p className={"message__date"}>{date}</p>
                </div>
                <div className={"message__content"}>{content}</div>
            </div>

            <button disabled={!userIsAuthorized} className='btn ms-auto' data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={userIsAuthorized ? 'white': 'currentColor'}
                     className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path
                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </button>
            {
                userIsAuthorized ?
                    <>
                        <ul className="dropdown-menu message__options p-2">
                            <li onClick={_onDeleteMessage}>Supprimer le message</li>
                        </ul>
                    </>
                    : ''
            }

        </div>
    </>
}

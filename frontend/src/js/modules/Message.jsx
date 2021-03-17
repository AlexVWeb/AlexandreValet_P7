import React, {useState} from "react"
import socketIOClient from "socket.io-client";
import UserController from "../Class/User";

const ENDPOINT = process.env.API_URL;
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})

export default function Message({avatar, date, content, id, image, user: {id: userId, pseudo}}) {
    const [userChangeAuthorized, setUserChangeAuthorized] = useState(false)
    let currentUser = UserController.getCurrentUser()

    let userIsAuthorized = userChangeAuthorized
    if ((currentUser.role === "ROLE_MEMBER" && currentUser.userId === userId) ||
        currentUser.role === "ROLE_ADMIN") {
        userIsAuthorized = true
    }

    io.on('user.newRole', ({id, role}) => {
        if (currentUser.userId === id) {
            role === 'ROLE_ADMIN' ? setUserChangeAuthorized(true) : setUserChangeAuthorized(false)
        }
    })

    const _onDeleteMessage = (e) => {
        e.preventDefault()
        if (userIsAuthorized && confirm("Voulez vous vraiment supprimer le message ?")) {
            io.emit('message.delete', {id, currentUser})
        }
    }

    function NewlineText(props) {
        const text = props.text;
        if (text) {
            return text.split('\n').map((str, index) => {
                return <p key={index}>{str}</p>
            });
        }

        return ''
    }

    return <>
        <div className="message">
            <img className="message__avatar"
                 src={avatar}
                 alt={`avatar message #${id}`}/>
            <div>
                <div className={"message__header"}>
                    <p className={"message__pseudo"}>{pseudo}</p>
                    <p className={"message__date"}>{date}</p>
                </div>
                <div className={"message__content"}>
                    {
                        image && <img src={`${process.env.API_URL}/uploads/${image}`} className="message__image" alt={""}/>
                    }
                    <NewlineText text={content}/>
                </div>
            </div>

            <button onClick={_onDeleteMessage} disabled={!userIsAuthorized} className='btn ms-auto'>
                {
                    userIsAuthorized && <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path
                                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </>
                }
            </button>

        </div>
    </>
}

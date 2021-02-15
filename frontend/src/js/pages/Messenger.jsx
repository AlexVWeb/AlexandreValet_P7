import React, {useEffect, useState} from "react"
import Images, {getCookie} from "../utils";
import Sidebar from "../modules/Sidebar";
import Message from "../modules/Message";
import socketIOClient from "socket.io-client";
import User from "../controllers/user"
import moment from 'moment';
moment.locale('fr')

const ENDPOINT = "http://localhost:3000";
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})

export default function Messenger() {
    let user = (new User()).getCurrentUser()
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])
    const [response, setResponse] = useState('');

    io.on("newMessage", (content) => {
        setMessages([...messages, content])
    });

    const token = getCookie('token')

    const _onSubmit = (e) => {
        e.preventDefault()
        let newMessage = {
            content: message,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            user: {
                id: user.userId,
                pseudo: user.pseudo
            }
        }
        io.emit("message", newMessage)
        setMessages([...messages, newMessage])
        setMessage('')
    }

    return <>
        <div id={"messenger"} className={"container-fluid container_messenger"}>
            <Sidebar/>
            <div className={"messenger_contents"}>
                <header>
                    <h3># Général</h3>
                </header>

                <div className="messenger_fil">
                    {
                        messages.map((message, key) => {
                            return <Message
                                    key={key}
                                    avatar={"https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"}
                                    pseudo={message.user.pseudo}
                                    date={moment(message.date).fromNow()}
                                    content={message.content}/>
                        })
                    }
                </div>

                <form onSubmit={_onSubmit} className="messenger_form">
                    {/*<div className={"messenger_form__message"}></div>*/}
                    <input onChange={(e) => setMessage(e.target.value)}
                           type="text"
                           className={"messenger_form__message"}
                           placeholder={'Envoyer un message à #général'} value={message}/>
                    <button className={"btn btn-primary me-3"}>Envoyé</button>
                </form>
            </div>
        </div>
    </>
}
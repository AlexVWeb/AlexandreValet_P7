import React, {useEffect, useState} from "react"
import Sidebar from "../modules/Sidebar";
import Message from "../modules/Message";
import socketIOClient from "socket.io-client";
import User from "../controllers/user"
import moment from 'moment';
import {ModalProfil} from "../modules/ModalProfil";

moment.locale('fr')

const ENDPOINT = process.env.API_URL;
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})

export default function Messenger() {
    let user = (new User()).getCurrentUser()
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])

    const scrollToBottom = (node) => {
        node.scrollTop = node.scrollHeight;
    }

    io.on("newMessage", (content) => {
        setMessages([...messages, content])
    });

    io.on("message.deleted", (id) => {
        const messagesFiltered = messages.filter(message => message.id !== id)
        setMessages(messagesFiltered)
    })

    useEffect(() => {
        async function effect() {
            // Chargement des messages
            let oldMessages = []
            let listMessageReq = await fetch(`${process.env.API_URL}/api/messages`)
            let listMessage = await listMessageReq.json()

            await Promise.all(listMessage.map(async (msg) => {
                const userRequest = await fetch(`${process.env.API_URL}/api/user/${msg.user_id}`)
                if (userRequest.ok) {
                    const user = await userRequest.json()
                    let newMessage = {
                        id: msg.id,
                        content: msg.content,
                        date: msg.date,
                        user: {
                            id: user.id,
                            pseudo: user.pseudo
                        }
                    }
                    oldMessages = [...oldMessages, newMessage]
                }
            }))
            oldMessages.sort((a, b) => {
                return (moment(a.date).isAfter(b.date)) ? 1 : ((moment(b.date).isAfter(a.date)) ? -1 : 0)
            })
            setMessages(oldMessages)

            scrollToBottom(document.querySelector('.messenger_fil'));
        }

        effect()
    }, [])

    const _onSubmit = (e) => {
        e.preventDefault()
        if (message !== '') {
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
            setTimeout(() => {
                scrollToBottom(document.querySelector('.messenger_fil'));
            }, 500)
        }
    }

    return <>
        <div id={"messenger"} className={"container-fluid container_messenger"}>
            <ModalProfil/>
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
                                date={moment(message.date).fromNow()}
                                content={message.content}
                                id={message.id}
                                user={message.user}
                            />
                        })
                    }
                </div>

                <form onSubmit={_onSubmit} className="messenger_form">
                    <input onChange={(e) => setMessage(e.target.value)}
                           type="text"
                           className={"messenger_form__message"}
                           placeholder={'Envoyer un message à #général'} value={message}/>
                </form>
            </div>
        </div>
    </>
}
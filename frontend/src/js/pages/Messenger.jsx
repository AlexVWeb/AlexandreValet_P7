import React, {useEffect, useState, useRef} from "react"
import {Sidebar} from "../modules/Sidebar";
import Message from "../modules/Message";
import socketIOClient from "socket.io-client";
import moment from 'moment';
import {ModalProfil} from "../modules/ModalProfil";
import UserController from "../Class/User";
import FileInput from "../modules/FileInput";
import {Modal} from "../modules/Modal";
import FileModal from "../modules/FileModal";
import {Modal as boostrapModal} from "bootstrap";

moment.locale('fr')

const ENDPOINT = process.env.API_URL;
const io = socketIOClient(ENDPOINT, {
    withCredentials: true
})

export default function Messenger() {
    let user = UserController.getCurrentUser()

    const messengerFillRef = useRef()
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])
    const [temporyFile, setTemporyFile] = useState()
    const modalFileRef = useRef()
    const [modalFile, setModalFile] = useState()
    const sidenavRef = useRef()
    const [sidenav, setSidenav] = useState()

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
                    let messageContent = msg.content
                    if (msg.content === 'null') {
                        messageContent = null
                    }
                    let newMessage = {
                        id: msg.id,
                        content: messageContent,
                        date: msg.date,
                        user: {
                            id: user.id,
                            pseudo: user.pseudo
                        },
                        image: msg.image
                    }
                    oldMessages = [...oldMessages, newMessage]
                }
            }))
            oldMessages.sort((a, b) => {
                return (moment(a.date).isAfter(b.date)) ? 1 : ((moment(b.date).isAfter(a.date)) ? -1 : 0)
            })
            setMessages(oldMessages)

            scrollToBottom(messengerFillRef.current);

            modalFileRef.current.addEventListener('hidden.bs.modal', function () {
                setTemporyFile(null)
            })

            setModalFile(new boostrapModal(modalFileRef.current))
            setSidenav(sidenavRef.current)
        }

        effect()
    }, [])

    const scrollToBottom = (node) => {
        node.scrollTop = node.scrollHeight;
    }

    io.on("newMessage", (content) => {
        setMessages([...messages, content])
        scrollToBottom(messengerFillRef.current);
    });

    io.on("newMessage.file", (content) => {
        if (content) {
            setMessages([...messages, content])
        }
    });

    io.on("message.deleted", (id) => {
        const messagesFiltered = messages.filter(message => message.id !== id)
        setMessages(messagesFiltered)
    })

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
                scrollToBottom(messengerFillRef.current);
            }, 500)
        }
    }

    const _openSidenav = (e) => {
        e.preventDefault()
        let modalSidebar = sidenav
        let sidebar = sidenav.querySelector('.sidenav')
        sidebar.style.width = "350px";
        modalSidebar.style.visibility = 'visible';
        modalSidebar.style.opacity = '1';
        modalSidebar.style.transition = 'visibility 0.2s linear, opacity 0.2s linear';
        sidebar.style.transition = 'width 0.5s';
    }

    return <>
        <div id={"messenger"} className={"container-fluid container_messenger"}>
            <Modal id={'modalAccount'} title="Éditer mon profil"><ModalProfil/></Modal>

            <Modal ref={modalFileRef} id={'fileModal'}>
                {
                    temporyFile &&
                    <FileModal currentMessage={message} fileObject={temporyFile}/>
                }
            </Modal>

            <Sidebar ref={sidenavRef}/>

            <div className={"messenger_contents"}>
                <header>
                    <h3># Général</h3>
                    <span onClick={_openSidenav} className="OpenSidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-people"
                             viewBox="0 0 16 16">
                          <path
                              d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                        </svg>
                    </span>
                </header>

                <div className="messenger_fil" ref={messengerFillRef}>
                    {
                        messages.map((message, key) => {
                            return <Message
                                key={key}
                                avatar={"https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"}
                                date={moment(message.date).fromNow()}
                                content={message.content}
                                id={message.id}
                                user={message.user}
                                image={message.image}
                            />
                        })
                    }
                </div>

                <form onSubmit={_onSubmit} className="messenger_form">
                    <input onChange={(e) => setMessage(e.target.value)}
                           className={"messenger_form__message"}
                           placeholder={'Envoyer un message à #général'} value={message}
                           title={"Champ d'ecriture du message"}/>

                    <FileInput modal={modalFile} fileObject={(file) => setTemporyFile(file)}/>

                    <button className={"btn btn-primary mx-3"} title={"Envoyer"}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.7249 7.555L2.72494 2.055C2.63873 2.01189 2.54189 1.99461 2.44608 2.00526C2.35028 2.0159 2.25959 2.05401 2.18494 2.115C2.11365 2.17475 2.06045 2.2532 2.0313 2.34153C2.00215 2.42985 1.99822 2.52456 2.01994 2.615L3.34494 7.5H8.99994V8.5H3.34494L1.99994 13.37C1.97956 13.4455 1.97718 13.5248 1.99299 13.6014C2.00881 13.678 2.04239 13.7499 2.09102 13.8111C2.13965 13.8724 2.20199 13.9214 2.27301 13.9542C2.34403 13.987 2.42176 14.0027 2.49994 14C2.57821 13.9995 2.65528 13.9807 2.72494 13.945L13.7249 8.445C13.8068 8.40304 13.8756 8.3393 13.9236 8.26078C13.9716 8.18226 13.997 8.09203 13.997 8C13.997 7.90798 13.9716 7.81774 13.9236 7.73923C13.8756 7.66071 13.8068 7.59696 13.7249 7.555V7.555Z"
                                fill="currentColor"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </>
}
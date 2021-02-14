import React from "react"

export default function Message({avatar, pseudo, date, content}) {
    return <>
        <div className="message">
            <img className="message__avatar"
                 src={avatar}
                 alt=""/>
            <div>
                <div className={"message__header"}>
                    <p className={"message__pseudo"}>{pseudo}</p>
                    <p className={"message__date"}>{date}</p>
                </div>
                <div className={"message__content"}>{content}</div>
            </div>
        </div>
    </>
}

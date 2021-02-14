import React from "react"
import Images, {getCookie} from "../utils";
import Sidebar from "../modules/Sidebar";
import Message from "../modules/Message";

export default function Messenger() {
    const token = getCookie('token')

    return <>
        <div id={"messenger"} className={"container-fluid container_messenger"}>
            <Sidebar/>
            <div className={"messenger_contents"}>
                <header>
                    <h3># Général</h3>
                </header>
                <div className="messenger_fil">
                    <Message
                        avatar={"https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"}
                        pseudo={"sabrus"}
                        date={"Aujourd'hui à 18h00"}
                        content="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor dolorem eum odio quia reprehenderit voluptatum"/>
                    <Message
                        avatar={"https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"}
                        pseudo={"sabrus"}
                        date={"Aujourd'hui à 18h00"}
                        content="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor dolorem eum odio quia reprehenderit voluptatum"/>
                </div>
                <form action="" className="messenger_form">
                    {/*<div className={"messenger_form__message"}></div>*/}
                    <input type="text" className={"messenger_form__message"}
                           placeholder={'Envoyer un message à #général'}/>
                </form>
            </div>
        </div>
    </>
}
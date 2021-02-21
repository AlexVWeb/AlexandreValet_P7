import React, {useEffect, useState} from "react";
import User from "./User";

export default function Sidebar() {
    const [admins, setAdmins] = useState([])
    const [members, setMembers] = useState([])
    useEffect(() => {
        async function effect() {
            let listUsersReq = await fetch(`${process.env.API_URL}/api/users`)
            let listUsers = await listUsersReq.json()
            let listAdmin = []
            let listMember = []
            listUsers.map((user) => {
                let roles = JSON.parse(user.roles)
                if (roles.find(e => e === 'ROLE_ADMIN')) {
                    listAdmin.push(user)
                }
                if (roles.find(e => e === 'ROLE_MEMBER')) {
                    listMember.push(user)
                }
            })
            setAdmins(listAdmin)
            setMembers(listMember)
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
                    admins.map((user) => {
                        return <>
                            <User pseudo={user.pseudo} id={user.id}/>
                        </>
                    })
                }
            </div>

            <div className="sidebar__heading">
                <p>Membres</p>
            </div>
            <div className="sidebar__users">
                {
                    members.map((user) => {
                        return <>
                            <User pseudo={user.pseudo} id={user.id}/>
                        </>
                    })
                }
                <User pseudo={"Michèle"} id={3}/>
            </div>
        </div>
    </>
}
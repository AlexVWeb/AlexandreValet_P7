import React, {useEffect} from "react";
export default function User({id, pseudo}) {
    return <>
        <div className="sidebar__user dropend">
            <img
                src={'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'}
                className="avatar-40px" alt={"avatar"}/>
            <p>{pseudo}</p>

            <button className='btn ms-auto' data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path
                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </button>
            <ul className="dropdown-menu user__options" data-user={id}>
                <li><a className="dropdown-item" href="#">Passez en administrateur</a></li>
                <li><a className="dropdown-item" href="#">Menu item</a></li>
                <li><a className="dropdown-item" href="#">Menu item</a></li>
            </ul>
        </div>
    </>
}

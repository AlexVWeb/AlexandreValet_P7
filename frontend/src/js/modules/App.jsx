import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch, useHistory
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Messenger from "../pages/Messenger";
import {deleteCookie, Images} from "../utils";
import User from "../controllers/user";

export const App = () => {
    const userIsLoggedIn = (new User()).isConnect()

    const LinkMenu = ({label, to, activeOnlyWhenExact, classname = ''}) => {
        const history = useHistory();
        let match = useRouteMatch({
            path: to,
            exact: activeOnlyWhenExact
        });

        let isCurrentLink = false
        if (match !== null) {
            if (match.isExact) {
                isCurrentLink = true
            }

            if (match.path === '/login' && userIsLoggedIn) {
                history.push("/messagerie")
            }

            if (match.path === '/register' && userIsLoggedIn) {
                history.push("/messagerie")
            }

            if (match.path === '/messagerie' && !userIsLoggedIn) {
                history.push("/login")
            }
        }

        return <Link className={isCurrentLink ? `nav-link active ${classname}` : `nav-link ${classname}`}
                     to={to}>{label}</Link>
    }

    const btnLogout = (e) => {
        e.preventDefault()
        deleteCookie('token')
        document.location.href = '/login'
    }

    return <>
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={Images('icon-left-font-monochrome-black.svg')} alt="Logo Navbar"/>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav w-100">
                            {
                                userIsLoggedIn ? <>
                                    <LinkMenu to="/messagerie" label={"Messagerie"}></LinkMenu>
                                    <button className={"btn"} onClick={btnLogout} id={"linkLogout"}>Déconnexion</button>
                                </> : <>
                                    <LinkMenu to="/login"
                                              label={"Connexion"}>Connexion</LinkMenu>
                                    <LinkMenu to="/register"
                                              label={"Inscription"}>Inscription</LinkMenu>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </nav>

            <Switch>
                {
                    userIsLoggedIn ? <>
                        <Route path="/messagerie">
                            <Messenger/>
                        </Route>
                    </> : <>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                    </>
                }
            </Switch>
        </Router>
    </>
}

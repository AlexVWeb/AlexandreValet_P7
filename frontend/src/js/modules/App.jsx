import React, {} from "react";
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
        if (confirm("Voulez vous vraiment vous déconnectez ?")) {
            deleteCookie('token')
            document.location.href = '/login'
        }
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
                                    <button className={"btn"} id={"btnAccount"} data-bs-toggle="modal"
                                            data-bs-target="#modalAccount">Profil
                                    </button>
                                    <button className={"btn"} onClick={btnLogout} id={"linkLogout"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                            <path fillRule="evenodd"
                                                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                        </svg>
                                    </button>
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

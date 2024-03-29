import React, {useRef} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch, useHistory, useParams
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Messenger from "../pages/Messenger";
import {deleteCookie, Images} from "../utils";
import User from "../Class/User";
import {Modal as BoostrapModal, Collapse} from 'bootstrap'

export const App = () => {
    const userIsLoggedIn = (new User()).isConnect()
    const navbarRef = useRef()

    if (window.location.pathname === '/' && !userIsLoggedIn) {
        document.location.href = '/login'
    }

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

    const openModalAccount = (e) => {
        e.preventDefault()
        let button = e.target
        let modalId = button.getAttribute('data-target-modal')
        let modal = new BoostrapModal(document.querySelector(modalId))
        modal.show()
    }

    const Route404 = (e) => {
        let path = useParams()
        path = path[0]
        if (!userIsLoggedIn && path !== '/login' && path !== '/register') document.location.replace('/login')
        if (userIsLoggedIn && path !== '/messagerie') document.location.replace('/messagerie')
        return '';
    }

    return <>
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={Images('icon-left-font-monochrome-black.svg')} alt="Logo Navbar"/>
                    </a>
                    <button className="navbar-toggler" type="button" aria-controls="navbarPrimary"
                            aria-expanded="false" aria-label="Toggle navigation" onClick={() => {
                        new Collapse(navbarRef.current)
                    }}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarPrimary" ref={navbarRef}>
                        <div className="navbar-nav w-100">
                            {
                                userIsLoggedIn ? <>
                                    <LinkMenu to="/messagerie" label={"Messagerie"}></LinkMenu>
                                    <button onClick={openModalAccount} className={"btn"} id={"btnAccount"}
                                            data-target-modal="#modalAccount">Profil
                                    </button>
                                    <a onClick={btnLogout} className="nav-link active" id={"linkLogout"}>Déconnexion</a>
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
                        <Route path="*"><Route404/></Route>
                    </> : <>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                        <Route path="*"><Route404/></Route>
                    </>
                }
            </Switch>
        </Router>
    </>
}

import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import whoAmI from './Who';
import CSRFToken from "./csrf";


function Dropdown({ user })
{
    if (user !== "")
    {
        return (
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to={'/'} className="nav-link">Cookies</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={"/leaderboard"} className="nav-link">Leaderboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={"/friends"} className="nav-link">Friends</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="http://127.0.0.1:8000/cookies/logout">Logout</a>
                    </li>
                </ul>
            </div>
        )
    }
    else
    {
        return (
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to={"/login"} className="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={"/register"} className="nav-link">Register</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={'/'} className="nav-link">Cookies</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={"/leaderboard"} className="nav-link">Leaderboard</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

function Navbar()
{
    const [who, setWho] = useState("");
    async function update()
    {
        const data = await whoAmI();
        setWho(data);
    }

    useEffect(() => {
        let ignore = false;
        if (!ignore)
            update();
        return () => {
            ignore = true;
        };
    });
    return (
        <nav className="navbar navbar-expand-lg my-3">
        <CSRFToken />
        <div className="container-fluid">
            <Link to={who ? `/user/${who}` : `/login`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                </svg>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
                <Dropdown user={who}/>
            </div>
        </div>
        </nav>
    )
}

export default Navbar;
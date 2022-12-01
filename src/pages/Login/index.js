import React from "react";
import { useEffect, useState } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';

export default function Login() {

    const [token, setToken] = useState("");

    const CLIENT_ID = "a6c10d8c0a4645148d713092c50057db"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Bem vindo ao spotifyzon!</h1>
                {!token ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}> Logar </a>
                : <li><Link to="/home">Home</Link></li>}
            </header>
        </div>
    )
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../../App.css'

export default function Home() {

    const [token, setToken] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [albuns, setAlbuns] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [albumSelected, setAlbumSelected] = useState([]);

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

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    }

    const searchAlbuns = async (e) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "album",
                limit: 10,
            }
        })

        setAlbuns(data.albums.items)
    }

    const renderAlbuns = () => {
        return albuns.map(albuns => (
            <div key={albuns.id} onClick={() => searchTracks(albuns.id, albuns)}>
                <div>
                    {albuns.images.length ? <img width={"100%"} src={albuns.images[0].url} alt="" /> : <div>No Image</div>}
                    {albuns.name}
                </div>
            </div>
        ))
    }

    const searchTracks = async (id, albuns) => {
        setAlbumSelected(albuns)
        const { data } = await axios.get("https://api.spotify.com/v1/albums/" + id + "/tracks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setTracks(data.items)
    }

    const renderTracks = () => {
        return tracks.map(tracks => (
          <div key={tracks.id}>
            {tracks.name}
          </div>
        ))
      }

    return (
        <div className="App">
            <header className="App-header">
                <div className="App-menu">
                    <h1>Spotifyzon</h1>
                    <form onSubmit={searchAlbuns}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)} />
                        <button type={"submit"}>Search</button>
                    </form>
                    <button onClick={logout}> Sair </button>
                </div>
                <div className="App-albuns">
                    {renderAlbuns()}
                    {albumSelected.images.length ? <img width={"100%"} src={albumSelected.images[0].url} alt="" /> : <div>No Image</div>}
                    {tracks ? 
                    <form>{renderTracks()}</form>: <div></div>}
                </div>
            </header>
        </div>
    );
}
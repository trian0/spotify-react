import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [albuns, setAlbuns] = useState([]);

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
    console.log("ALBUNS", albuns)
    return albuns.map(albuns => (
      <div key={albuns.id}>
        {albuns.images.length ? <img width={"100%"} src={albuns.images[0].url} alt="" /> : <div>No Image</div>}
        {albuns.name}
      </div>
    ))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1> Spotifyzon </h1>
        {!token ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}> Logar </a>
          : <button onClick={logout}> Sair </button>}
        {token ?
          <form onSubmit={searchAlbuns}>
            <input type="text" onChange={e => setSearchKey(e.target.value)} />
            <button type={"submit"}>Search</button>
            {renderAlbuns()}
          </form> : <h2>Por favor, faça o login!</h2>}
      </header>
    </div>
  );
}

export default App;

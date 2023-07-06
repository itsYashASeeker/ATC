import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import CryptoJS from "crypto-js";

function Register() {
    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [cookies, setCookie] = useCookies(["session"]);

    const register = async () => {
        if (!name || !email || !username || !password) {
            window.alert("Please enter all fields!");
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            await axios.post(process.env.REACT_APP_SERVER_URL + "/register",
                { name, email, username, password },
                config)
                .then((response) => {
                    const tt = response.data.user.token;
                    const sessionToken = CryptoJS.AES.encrypt(tt,
                        process.env.REACT_APP_ENCRYPT_SECRET).toString();
                    setCookie("session", sessionToken, { path: "/", maxAge: 60 * 60 * 24 * 2 });
                    window.alert("User successfully registered!");
                }
                );
        } catch (error) {
            window.alert("Some error occured..Please try again!");
        }
    }

    return (
        <>
            <input placeholder="name" onChange={(e) => setName(e.target.value)}></input>
            <input placeholder="username" onChange={(e) => setUsername(e.target.value)}></input>
            <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={register}>Register</button>
        </>
    )
}

export default Register;
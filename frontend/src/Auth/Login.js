import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [cookies, setCookie] = useCookies(["session"]);

    const navigate = useNavigate();
    

    const login = async () => {
        if (!username || !password) {
            window.alert("Please enter all fields!");
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            await axios.post(process.env.REACT_APP_SERVER_URL+"/login",
                { username, password },
                config)
                .then((response) => {
                    // const tt = response.data.user.token;
                    // const sessionToken = CryptoJS.AES.encrypt(tt, 
                    //     process.env.REACT_APP_ENCRYPT_SECRET).toString();
                    // setCookie("session", sessionToken, { path: "/", maxAge: 60*60*24*2 });
                    window.alert("User successfully logged in!");
                });
            navigate("/user");
        } catch (error) {
            // window.alert(error.response.data.error);
            // console.log(error.response);
            if (error.response.data.error ==="Password Incorrect!"){
                window.alert("Password Incorrect!");
            }
            else {
                window.alert("Account doesn't exist!");
            }
        }
    }

    return (
        <>
            <input placeholder="username" onChange={(e) => setUsername(e.target.value)}></input>
            <input placeholder="password" onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={login}>Login</button>
        </>
    )
}

export default Login;
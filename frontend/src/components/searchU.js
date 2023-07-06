import React, { useEffect, useState } from "react";
import { AppState } from "../context/appcontext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../User/user.css";

export default function SearchU() {
    const { user } = AppState();
    const [cookies, setCookie, removeCookie] = useCookies(["session"]);
    const navigate = useNavigate();
    const [usersF, setUsersF] = useState();

    const logoutFunc = () => {
        removeCookie("session", { path: "/" });
        navigate("/");
    }

    const goTo = (ll) => {
        navigate("/" + ll);
    }

    async function doSearchU(vv){
        console.log(user);
        if(vv){
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        "authorization": "Bearer "+(user.token),
                    }
                }
                await axios.get(process.env.REACT_APP_SERVER_URL + "/search/users?search="+vv,
                    config)
                    .then((response) => {
                        // setUsersF(response);
                        console.log(response);
                    });
                // navigate("/user");
            } catch (error) {
                // window.alert(error.response.data.error);
                // console.log(error.response);
                // if (error.response.data.error === "Password Incorrect!") {
                //     window.alert("Password Incorrect!");
                // }
                // else {
                //     window.alert("Account doesn't exist!");
                // }
            }
        }
    }

    return (
        <>
            <div className="dflex fdirC">
                <input placeholder="search user..." onChange={(e)=>{doSearchU(e.target.value)}}></input>
                <ul className="dflex fdirC">
                    <li className="dflex ucard">
                        <p className="username">Username</p>
                        <button className="follow">Follow</button>
                    </li>
                </ul>
                
            </div>
        </>
    )
}

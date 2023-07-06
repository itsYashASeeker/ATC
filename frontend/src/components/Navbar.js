import React, { useEffect, useState } from "react";
import { AppState } from "../context/appcontext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../User/user.css";

export default function Navbar(){

    const { user } = AppState();
    const [cookies, setCookie, removeCookie] = useCookies(["session"]);
    const [viewD, setViewD] = useState(false);
    const navigate = useNavigate();

    const logoutFunc = () => {
        removeCookie("session", { path: "/" });
        navigate("/");
    }

    const goTo = (ll) => {
        navigate("/" + ll);
    }

    const handleD = () =>{
        if(viewD){
            setViewD(false);
        }
        else{
            setViewD(true);
        }
    }

    // window.onclick(function(){
    //     setViewD(false);
    // })

    return(
        <div className="navbar dflex">
            <div className="fGr1">
                <h1>ATC</h1>
            </div>
            <div className="userD">
                <button onClick={handleD}>Dashboard</button>
                {viewD ? 
                    <div className="dashb">
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                        <p><span>Followers: </span><span>{user.followers.length}</span></p>
                        <p>Following: {user.following.length}</p>
                    </div>
                    : <></>
                }
            </div>

        </div>
    )
}
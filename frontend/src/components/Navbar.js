import React, { useEffect, useState } from "react";
import { AppState } from "../context/appcontext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../css/navbar.css";
import "../css/index1.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {

    const { userD } = AppState();
    const [uD, setUD] = userD;
    const navigate = useNavigate();
    const logoutFunc = () => {
        // removeCookie("session", { path: "/" });
        // navigate("/");
    }

    const goTo = (ll) => {
        navigate("/" + ll);
    }



    // window.onclick(function(){
    //     setViewD(false);
    // })

    return (
        <div className="divf navbar paddSM">
            {uD ?
                <div className="divf jusSpaceB">
                    <button className="profileS f1-5 paddSM bRadiusSM">Search... <FontAwesomeIcon icon={faSearch} /></button>
                    <button className="profileS f1-5 paddSM bRadiusS">Create <FontAwesomeIcon icon={faPlusSquare} /></button>
                </div>
                :
                <></>
            }

        </div>
    )
}
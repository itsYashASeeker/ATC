import React, { useEffect } from "react";
import { AppState } from "../context/appcontext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./user.css";
import Navbar from "../components/Navbar";
import SearchU from "../components/searchU";

function User() {
    const { user } = AppState();
    const [cookies, setCookie, removeCookie] = useCookies(["session"]);
    const navigate = useNavigate();

    const logoutFunc = () => {
        removeCookie("session", { path: "/" });
        navigate("/");
    }

    const goTo = (ll) => {
        navigate("/" + ll);
    }

    return (
        <>
            {user ?
                <>
                    <Navbar />
                    <div className="dflex fdirC bgW fullWH">
                        <SearchU />
                        <h1>Hello {user.name}</h1>
                        <h1>Username: {user.username}</h1>
                        <h1>email: {user.email}</h1>
                        <button onClick={logoutFunc}>Logout</button>
                    </div>
                </>
                :
                <>
                    <h1>Please Login</h1>
                    <button onClick={goTo("login")}>Login</button>
                </>

            }
        </>
    )
}

export default User;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../css/index1.css";
import "../css/auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faCheckCircle, faCircleCheck, faCircleExclamation, faSquarePlus } from '@fortawesome/free-solid-svg-icons';


function Login() {
    const [username, setUsername] = useState();
    const [upassword, setUPassword] = useState();
    const [loadUn, setLoadUn] = useState();

    const navigate = useNavigate();

    const timer = ms => new Promise(res => setTimeout(res, ms));

    function retId(idname) {
        return document.getElementById(idname)
    }

    const validateField = async (val, fieldType) => {
        await timer(200);
        await axios.post(process.env.REACT_APP_SERVER_URL + "/validate-fields", { fields: [fieldType, val] },
            { withCredentials: true })
            .then((data) => {
                // console.log(data.data);
                console.clear();
                setLoadUn(-1);
            })
            .catch((err) => {
                setLoadUn(1);
                console.clear();
                var errs = err.response.data.error;
                for (var i = 0; i < errs.length; i++) {
                    console.log(errs[i]);
                }
            })
    }

    const doLogin = async () => {
        retId("loginB").classList.add("paddRM");
        retId("loginLoader").classList.add("fullOp");
        await timer(100);
        retId("loginB").setAttribute("disabled", "disabled");
        await timer(200);
        await axios.post(process.env.REACT_APP_SERVER_URL + "/login", {
            username,
            password: upassword
        }, { withCredentials: true }
        )
            .then((data) => {
                console.clear();
                window.alert(data.data)
            })
            .catch((err) => {
                retId("loginB").removeAttribute("disabled");
                console.clear();
                var errs = err.response.data.error;
                for (var i = 0; i < errs.length; i++) {
                    window.alert(errs[i]);
                }
            })
        retId("loginB").classList.remove("paddRM");
        retId("loginLoader").classList.remove("fullOp");
    }

    const login = () => {
        if (!username || loadUn!=1) {
            retId("iduUsername").classList.add("openSpI1")
            retId("iduUsername").focus();
        }
        else if (!upassword) {
            retId("iduPassword").classList.add("openSpI1")
            retId("iduPassword").focus();
        }
        else {
            doLogin();
        }
    }


    const handleUsername = (val) => {
        if (!val)
            setLoadUn();
        else {
            setLoadUn(0);
            validateField(val, "username");
        }
    }

    // useEffect(() => {
    //     if (username) {
    //         retId("iduUsername").classList.remove("openSpI1")
    //     }
    //     else if (upassword) {
    //         retId("iduPassword").classList.remove("openSpI1")
    //     }
    // }, [username, upassword])

    return (
        <>
            <div className="divf fDirC fullbg">
                <div className=" loginC bRadiusS paddS posR marginS">
                    <span className="spinner"></span>
                    <div className="fullWHP divf fDirC posR bgWhite paddMM">
                        <p className="mTopS lTitle">Login to Asynchronous..</p>
                        <div className="divf insD posR mTopL">
                            <p className="bRadiusSM paddSM divf spP1">Username {username ? <>: {username}</> : <></>}</p>
                            <input type="text" id="iduUsername" className="bRadiusSM paddSM spI1" placeholder="Username" onChange={(e) => { setUsername(e.target.value); handleUsername(e.target.value) }} value={username}></input>
                            {loadUn === 0 ?
                                <span className="comment loader1"></span> : <></>
                            }
                            {loadUn === -1 ?
                                <FontAwesomeIcon className="comment cRed" icon={faCircleExclamation} /> : <></>
                            }
                            {loadUn === 1 ?
                                <FontAwesomeIcon className="comment cGreen" icon={faCheckCircle} /> : <></>
                            }
                        </div>
                        <div className="divf insD posR mTopS">
                            <p className="bRadiusSM paddSM divf spP1">{upassword ? <>{upassword.split("").map((el) => { return <>*</> })}</> : <>Password</>}</p>
                            <input type="password" id="iduPassword" className="bRadiusSM paddSM spI1" placeholder="Password" onChange={(e) => { setUPassword(e.target.value); }} value={upassword}></input>
                        </div>
                        <div className="divf jusSpaceB mTopL">
                            <button className="paddSM f1-2" onClick={() => { navigate("/register") }}>Sign Up?</button>
                            <button id="loginB" className="posR paddSM bRadiusSM buttonAS" onClick={login}>Login<span id="loginLoader" className="loader1"></span></button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AppState } from "../context/appcontext";
import Navbar from "../components/Navbar";
import "../css/home.css";
import "../css/index1.css";
import { faComment, faCommentDots, faHeart, faSignsPost, faSquarePlus, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function Home() {
    const { userD } = AppState();
    const [uD, setUD] = userD;
    const [postD, setPostD] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            await axios.get(process.env.REACT_APP_SERVER_URL + "/user/fetch/posts", { withCredentials: true })
                .then((data) => {
                    // console.log(data.data);
                    // console.clear();
                    setPostD(data.data);
                })
                .catch((err) => {
                    console.clear();
                    var errs = err.response.data.error;
                    for (var i = 0; i < errs.length; i++) {
                        console.log(errs[i]);
                    }
                })
        }
        fetchPosts();
    }, [])

    function retId(idname) {
        return document.getElementById(idname);
    }

    const openComBox = (index) => {
        retId(`pDoC${index}`).style.display === "flex" ? retId(`pDoC${index}`).style.display = "none":retId(`pDoC${index}`).style.display = "flex";
    }

    const removeComs = (index) => {
        retId(`pDoC${index}`).style.display = "none";
    }


    return (
        <>
            <Navbar />
            <div className=" fullbg fullbgN ">
                {uD ?
                    <>
                        <div className="divf fDirC sideP fGapM paddM bRadiusM">
                            <button className="bRadiusS paddSM f1-3 sidePB"><FontAwesomeIcon icon={faUserCircle} /> {uD.username}</button>
                            <button className="bRadiusS paddSM f1-3 sidePB">Followers: {uD.followers.length}</button>
                            <button className="bRadiusS paddSM f1-3 sidePB">Following: </button>
                        </div>

                        <div className="divf posR mainP paddSM">
                            {postD && postD.map((pEl, index) => {
                                return (
                                    <>
                                        <div className="bRadiusS postCard paddM f1-5 posR" onMouseLeave={() => removeComs(index)}>
                                            <p className="f1 jusRight showPost">Posted by: {pEl.author.username}</p>
                                            <p className="postContent mTopS">{pEl.content}</p>
                                            <div className="divf fGapS lAndC bRadiusL paddS fGapS mTopS showPost">
                                                <button className="paddS bRadiusL">{pEl.likes.length} <FontAwesomeIcon icon={faHeart} /></button>
                                                <button id={"postBC" + index} className="paddS bRadiusL" onClick={(e) => { openComBox(index) }}>{pEl.comments.length} <FontAwesomeIcon icon={faComment} /></button>
                                            </div>
                                            <div id={"pDoC" + index} className="divf pComments bRadiusSM paddS fDirC">
                                                <div className="divf doComment paddS f1-5 fGapS">
                                                    <input className="bRadiusM paddS" placeholder="comment something..." />
                                                    <button>
                                                        <FontAwesomeIcon className="f1-2" icon={faSquarePlus} />
                                                    </button>
                                                </div>
                                                {pEl.comments.map((el) => {
                                                    return (
                                                        <>
                                                            <div className="pCCard paddS">
                                                                <p className="pcAuthor" >Comment Author</p>
                                                                <div className="divf">
                                                                    <p className="commentCont">{el.content}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )
                            })}

                        </div>
                    </>

                    :
                    <>
                        <button name="register" onClick={() => { navigate("/register") }}>Register</button>
                        <button name="login" onClick={() => { navigate("/login") }}>Login</button>
                    </>
                }
            </div>
        </>

    )
}

export default Home;
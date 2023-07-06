import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const AppContext = createContext();


const AppProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [cookies, setCookie] = useCookies(["session"]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const accessPaths = ["/login", "/register"];
        const fetchAccount = async()=>{

            if(cookies.session){
                try {
                    const bytes = CryptoJS.AES.decrypt(cookies.session,
                        process.env.REACT_APP_ENCRYPT_SECRET);
                    const sessionToken = bytes.toString(CryptoJS.enc.Utf8);
                    const config = {
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${sessionToken}`
                        }
                    }
                    await axios.get(process.env.REACT_APP_SERVER_ACCESS_ACCOUNT, config)
                    .then((response) => {
                        setUser(response.data.user);
                    })
                    if(accessPaths.includes(location.pathname)){
                        navigate("/");
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            else if (accessPaths.includes(location.pathname)) {
                console.log("Not Authorized");
            } 
            else{
                navigate("/");
            }

        }
        fetchAccount();

    }, [navigate]);

    return (<AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>)
};

export const AppState = () => {
    return useContext(AppContext)
}

export default AppProvider;
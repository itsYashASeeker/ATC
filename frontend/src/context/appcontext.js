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
    const fullLocation = location.pathname;

    const accessPaths = ["/login", "/register"];
    useEffect(() => {
        const fetchUser = async () => {
            await axios.get(process.env.REACT_APP_SERVER_ACCESS_ACCOUNT, {
                withCredentials: true
            })
                .then((data) => {
                    console.clear();
                    var uDD = data.data;
                    setUser(uDD);
                    console.log(uDD.isAdmin ? "Hello Admin" : "Hello User");
                    if (accessPaths.includes(fullLocation)) {
                        navigate("/");
                    }
                })
                .catch((err) => {
                    setUser(false);
                    console.clear();
                    // var errs = err.response.data.error;
                    // for (var i = 0; i < errs.length; i++) {
                    //     console.log(errs[i]);
                    // }
                    console.log(err);
                })
        }
        fetchUser();
    }, [fullLocation])

    return (<AppContext.Provider value={{ userD: [user, setUser] }}>{children}</AppContext.Provider>)
};

export const AppState = () => {
    return useContext(AppContext)
}

export default AppProvider;
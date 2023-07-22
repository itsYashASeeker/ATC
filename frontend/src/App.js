import { HashRouter, Route, Link, Routes } from "react-router-dom";
import Register from "./Auth/Register";
import Home from "./Homepage/Home";
import Login from "./Auth/Login";
import AppProvider from './context/appcontext';

function App() {
  return (
    <HashRouter>
      <AppProvider>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
      </AppProvider>
    </HashRouter>
  );
}

export default App;

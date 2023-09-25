import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chats from "./pages/Chats";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.css";
import NavigationBar from "./Components/NavigationBar";
import Home from "./pages/Home";
import { ToastContainer, toast } from "react-toastify";
import "./index.css";
import ChatContainer from "./pages/ChatContainer";
import AskPlutus from "./pages/AskPlutus";
function App() {
  return (
    <BrowserRouter>
      <>
        <div className="app-container">
          <div className="nav-bar">
            <NavigationBar />
          </div>
          <div className="content">
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chats />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ask-plutus" element={<AskPlutus/>} />
            </Routes>
          </div>
        </div>
      </>
    </BrowserRouter>
  );
}
export default App;

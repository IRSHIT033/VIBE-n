import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import "./App.css";
import PersistLogin from "./components/Authentication/PersistLogin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route element={<PersistLogin />}>
          <Route path="/chats" element={<ChatPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

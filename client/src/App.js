import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import { SnackbarProvider } from "notistack";
import RoomPage from "./Pages/RoomPage/RoomPage";

function App() {
  return (
    <SnackbarProvider autoHideDuration={1000}>
      <div className="App">
        <Routes>
          <Route path="/room/:room" Component={RoomPage} />
          <Route path="/" Component={HomePage} />
        </Routes>
      </div>
    </SnackbarProvider>
  );
}

export default App;

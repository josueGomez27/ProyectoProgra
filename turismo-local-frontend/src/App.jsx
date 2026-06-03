import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Places from "./pages/Places";
import AdminPlaces from "./pages/AdminPlaces";
import Error404 from "./pages/Error404";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/places/:id" element={<Places />} />

                {/* Panel de administración */}
                <Route path="/admin/places" element={<AdminPlaces />} />

                {/* Página de error */}
                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
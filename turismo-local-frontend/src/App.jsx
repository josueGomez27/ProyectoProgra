import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Places from "./pages/Places";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlaces from "./pages/AdminPlaces";
import AdminCategories from "./pages/AdminCategories";
import AdminTowns from "./pages/AdminTowns";
import AdminUsers from "./pages/AdminUsers";
import AdminStats from "./pages/AdminStats";
import QrGenerator from "./pages/QrGenerator";
import OAuthSuccess from "./pages/OAuthSuccess";
import Error404 from "./pages/Error404";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login/town/:townId" element={<Login />} />

                <Route path="/oauth-success" element={<OAuthSuccess />} />

                <Route path="/home" element={<><Navbar /><Home /></>} />
                <Route path="/places/:id" element={<><Navbar /><Places /></>} />

                <Route path="/admin" element={<><Navbar /><AdminDashboard /></>} />
                <Route path="/admin/places" element={<><Navbar /><AdminPlaces /></>} />
                <Route path="/admin/qr" element={<><Navbar /><QrGenerator /></>} />
                <Route path="/admin/categories" element={<><Navbar /><AdminCategories /></>} />
                <Route path="/admin/towns" element={<><Navbar /><AdminTowns /></>} />
                <Route path="/admin/users" element={<><Navbar /><AdminUsers /></>} />
                <Route path="/admin/stats" element={<><Navbar /><AdminStats /></>} />

                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
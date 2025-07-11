import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import viteLogo from "/vite.svg";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "./App.css";

import ProfilePage from "./pages/ProfilePage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import TechniquesPage from "./pages/TechniquesPage.jsx";
import ClubsPage from "./pages/ClubsPage.jsx";
import GroupsPage from "./pages/GroupsPage.jsx";
import LogPage from "./pages/LogPage.jsx";
import MembersPage from "./pages/MembersPage.jsx";
import SeminarsPage from "./pages/SeminarsPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";

function App() {
    return (
        <div className="layout">
            <Sidebar />

            <main className="content">
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/profile" replace />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/techniques" element={<TechniquesPage />} />
                    <Route path="/clubs" element={<ClubsPage />} />
                    <Route path="/groups" element={<GroupsPage />} />
                    <Route path="/log" element={<LogPage />} />
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/seminars" element={<SeminarsPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                    <Route path="*" element={<h1>404</h1>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;

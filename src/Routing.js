import Nav from './components/Nav.js';
import Watch from './pages/Watch.js';
import Broadcast from './pages/Broadcast.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from "socket.io-client";

const Routing = () => {
    return (
        <div>
            <Router>
                <Nav />
                <Routes>
                    <Route path="/watch" element={<Watch />} />
                    <Route path="/broadcast" element={<Broadcast />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Routing;
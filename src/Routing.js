import Nav from './components/Nav.js';
import Watch from './pages/Watch.js';
import Homepage from './pages/Homepage.js';
import Broadcast from './pages/Broadcast.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Routing = () => {
    return (
        <div>
            <Router>
                <Nav />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/watch" element={<Watch />} />
                    <Route path="/broadcast" element={<Broadcast />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Routing;
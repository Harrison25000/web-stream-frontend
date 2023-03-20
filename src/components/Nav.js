import { Link } from 'react-router-dom';
import '../css/Nav.css';

function Nav() {
    return (
        <div className="App">
            <div className="NavBar">
                <Link to="/" id="navTitle">Web Stream</Link>
            </div>
        </div>
    );
}

export default Nav;
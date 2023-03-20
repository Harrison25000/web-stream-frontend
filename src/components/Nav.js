import '../css/Nav.css';

function Nav() {
    return (
        <div className="App">
            <div className="NavBar">
                <h1 id="navTitle" onClick={() => window.location.href = "/"}>Web Stream</h1>
            </div>
        </div>
    );
}

export default Nav;
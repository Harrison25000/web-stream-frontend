import { Constants } from '../Constants';
import '../css/homepage.css';
import broadcastIcon from '../images/broadcastIcon.png';
import watchIcon from '../images/watchIcon.png';

const Homepage = () => {

    const tabClicked = (goTo) => {
        switch (goTo) {
            case Constants.WATCH:
                window.location.href = "/watch"
                break;

            case Constants.BROADCAST:
                window.location.href = "/broadcast"
                break;

            default:
                break;
        }
    }

    return (
        <div className="HomepageDiv">
            <div className="HomepageTab" onClick={() => tabClicked(Constants.WATCH)}>
                <img src={watchIcon} alt="watch" id="watchIconImage"></img>
                <h3 id="watchTabTitle">Watch</h3>
            </div>
            <div className="HomepageTab" onClick={() => tabClicked(Constants.BROADCAST)}>
                <img src={broadcastIcon} alt="broadcast" id="broadcastIconImage"></img>
                <h3 id="broadcastTabTitle">Broadcast</h3>
            </div>
        </div >
    )
}

export default Homepage;
import { useEffect, useState } from 'react';
import { getNumberOfwatchers, getSocket, addWatcher, removeWatcher, getComments } from '../Helpers';
import '../css/watch.css';
import '../css/video.css';
import Comments from '../components/Comments';
import watchMessage from '../images/watchMessage.png';

const Watch = () => {

    const [startWatching, setStartWatching] = useState(false);
    const [numberOfWatchers, setNumberOfWatchers] = useState(0);
    const [availableBroadcast, setAvailableBroadcast] = useState(false);
    const [mute, setMute] = useState(false);

    useEffect(() => {
        getNumberOfwatchers().then(count => setNumberOfWatchers(count));
    }, [])

    useEffect(() => {
        initialiseWatching();
    }, [startWatching])

    const initialiseWatching = async () => {
        let peerConnection;
        const config = {
            iceServers: [
                {
                    "urls": "stun:stun.l.google.com:19302",
                },
                // {
                //   "urls": "turn:TURN_IP?transport=tcp",
                //   "username": "TURN_USERNAME",
                //   "credential": "TURN_CREDENTIALS"
                // }
            ]
        };

        const video = document.querySelector("video");

        const socket = await getSocket();

        socket.on("offer", (id, description) => {
            peerConnection = new RTCPeerConnection(config);
            peerConnection
                .setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("answer", id, peerConnection.localDescription);
                });
            peerConnection.ontrack = event => {
                setAvailableBroadcast(true);
                video.srcObject = event.streams[0];
                video.play();
            };
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };
        });


        socket.on("candidate", (id, candidate) => {
            peerConnection
                .addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error(e));
        });

        socket.on("connect", async () => {
            socket.emit("watcher");
        });

        socket.on("broadcaster", () => {
            socket.emit("watcher");
        });

        window.onunload = window.onbeforeunload = () => {
            if (startWatching) {
                socket?.close();
                peerConnection?.close();
                removeWatcher();
            }
        };

        if (!startWatching) {
            socket.close();
            video.pause();
        }

        function enableAudio() {
            video.muted = false;
        }
    }

    window.onunload = window.onbeforeunload = () => {
        if (startWatching) {
            removeWatcher();
            setStartWatching(false);
        }
    };

    return (
        <>
            <div className='WatchPageTitleDiv'>
                <p id='watchTitleText'>Watch</p>
            </div>
            <div className="WatchPage">
                <div className='WatchVideoSection'>
                    <div className="WatchVideoSubSection">
                        <video id="videoStream" poster={watchMessage} playsInline autoPlay muted={mute}>
                        </video>
                        <div className='VideoButtons'>
                            <button
                                onClick={() => {
                                    if (!startWatching) {
                                        addWatcher();
                                        setNumberOfWatchers(numberOfWatchers + 1);
                                        setStartWatching(true);
                                    }
                                }}
                                className="Button"
                            >
                                <p id="playButtonText">&#8895;</p>
                            </button>
                            <button
                                onClick={() => {
                                    if (startWatching) {
                                        removeWatcher();
                                        setNumberOfWatchers(numberOfWatchers - 1);
                                        setStartWatching(false);
                                    }
                                }}
                                className="Button"
                            >II
                            </button>
                            <button
                                onClick={() => {
                                    setMute(!mute);
                                }}
                                className={`Button ${!mute ? 'fas fa-volume-mute' : 'fas fa-volume-up'}`}
                            >
                            </button>
                            <p id='numberOfViewers' style={{ textAlign: "right" }}> Number of viewers: {numberOfWatchers}</p>
                        </div>
                    </div>
                </div>
                <div className='CommentVideoSection'>
                    <Comments />
                </div>

            </div >
        </>
    )
}

export default Watch;
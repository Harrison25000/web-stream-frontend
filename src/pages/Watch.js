import { useEffect, useState } from 'react';
import { getNumberOfwatchers, getSocket, addWatcher, removeWatcher } from '../Helpers';
import '../css/watch.css';
import '../css/video.css';

const Watch = () => {

    const [startWatching, setStartWatching] = useState(false);
    const [numberOfWatchers, setNumberOfWatchers] = useState(0);

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
            socket.close();
            peerConnection.close();
            removeWatcher();
        };

        if (!startWatching) {
            socket.close();
            video.pause();
        }

        function enableAudio() {
            video.muted = false;
        }
    }

    window.onunload = () => {
        if (startWatching) {
            removeWatcher();
            setStartWatching(false);
        }
    };

    return (
        <div className="WatchPage">
            <div className='WatchPageTitleDiv'>
                <p id='watchTitleText'>Watch Page</p>
                <p id='watchTitleCount'> Number of viewers: {numberOfWatchers}</p>
            </div>
            <video id="videoStream" playsInline autoPlay>
            </video>
            <div className='VideoButtons'>
                <button
                    onClick={() => {
                        if (!startWatching) {
                            addWatcher();
                            setNumberOfWatchers(numberOfWatchers + 1)
                            setStartWatching(true)
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
                            setNumberOfWatchers(numberOfWatchers - 1)
                            setStartWatching(false)
                        }
                    }}
                    className="Button"
                >II
                </button>
            </div>

        </div >
    )
}

export default Watch;
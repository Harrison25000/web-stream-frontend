import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

const Watch = ({ socket }) => {

    const [startWatching, setStartWatching] = useState(false);

    useEffect(() => {
        initialiseWatching();
    }, [startWatching])

    const initialiseWatching = () => {
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

        if (window.location.host.includes("localhost")) {
            var socket = io.connect('localhost:4000', { reconnect: true });
        } else {
            var socket = io.connect('https://web-stream-backend.herokuapp.com/', { reconnect: true });
        }

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

        socket.on("connect", () => {
            socket.emit("watcher");
        });

        socket.on("broadcaster", () => {
            socket.emit("watcher");
        });

        console.log({ socket });
        window.onunload = window.onbeforeunload = () => {
            socket.close();
            peerConnection.close();
        };

        function enableAudio() {
            console.log("Enabling audio")
            video.muted = false;
        }
    }

    return (
        <div>
            <h1 id="title">Watch Page</h1>
            <video id="videoStream" playsInline autoPlay>
            </video>
            <button onClick={() => setStartWatching(true)}>Start Watching?</button>
        </div>
    )
}

export default Watch;
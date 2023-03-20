import { io } from "socket.io-client";

export const getBackendUrl = () => {
    return "http://localhost:4000/"
}

export const getNumberOfwatchers = async () => {
    var count = 0;
    await fetch(getBackendUrl() + 'getwatchers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(data => data.json()).then(res => count = res.count);
    console.log(count)
    return count;
}

export const addWatcher = async () => {
    return await fetch(getBackendUrl() + 'setwatcher', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(data => data.json());
}

export const removeWatcher = async () => {
    return await fetch(getBackendUrl() + 'removewatcher', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(data => data.json());
}

export const getSocket = async () => {
    var socket;
    if (window.location.host.includes("localhost")) {
        socket = io.connect('localhost:4000', { reconnect: true });
    } else {
        socket = io.connect('https://web-stream-backend.herokuapp.com/', { reconnect: true });
    }
    return socket;
}
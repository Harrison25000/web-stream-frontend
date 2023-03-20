import { io } from "socket.io-client";

export const getBackendUrl = () => {
    if (window.location.host.includes("localhost")) {
        return "http://localhost:4000/"
    } else {
        return "https://web-stream-backend.herokuapp.com/"
    }
}

export const getComments = async () => {
    var comments = [];
    try {
        await fetch(getBackendUrl() + 'getcomments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(data => data.json()).then(item => comments.push(JSON.parse(item.comments)));
    } catch (error) {
        console.log(error);
    }
    return comments.flatMap(data => data).reverse();
}

export const getNumberOfwatchers = async () => {
    var count = 0;
    await fetch(getBackendUrl() + 'getwatchers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(data => data.json()).then(res => count = res.count);
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

export const submitComment = async (e) => {
    e.preventDefault();
    const comment = e.target[0].value
    await fetch(getBackendUrl() + 'savecomment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: { comment } })
    });
}
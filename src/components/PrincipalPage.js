import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const PrincipalPage = () => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const socket = io('http://localhost:4000'); // Change the URL if your server is hosted elsewhere

    useEffect(() => {
        // Listen for connected users update from the server
        socket.on('connectedUsersUpdate', (users) => { // Change 'users' to 'connectedUsers'
            setConnectedUsers(users);
            console.log("Connected Users:", users); // Log connectedUsers array to console
        });

        // Clean up the connection on unmount
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <div>
            <h2>Connected Users</h2>
            <ul>
                {connectedUsers.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </div>
    );
};

export default PrincipalPage;

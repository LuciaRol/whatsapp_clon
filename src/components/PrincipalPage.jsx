import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const PrincipalPage = () => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const socket = io('http://localhost:4000'); // Change the URL if your server is hosted elsewhere

    useEffect(() => {
        // Fetch initial list of connected users when component mounts
        fetchConnectedUsers();

        // Set up interval to fetch connected users every 5 seconds
        const interval = setInterval(fetchConnectedUsers, 10000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchConnectedUsers = () => {
        // Send a request to the server to get the list of connected users
        fetch('http://localhost:4000/connectedUsers')
            .then(response => response.json())
            .then(users => {
                setConnectedUsers(users);
                console.log("Connected Users:", users);
            })
            .catch(error => {
                console.error('Error fetching connected users:', error);
            });
    };

    return (
        <>
        <div className='principal-container'>
            <h2>Usuarios conectados:</h2>
            <div>
                <ul className='principal-container-lista'>
                    {connectedUsers.map((user, index) => (
                        <li className="principal-container-item" key={index}>{user}</li>
                    ))}
                </ul>
            </div>
            
        </div>
        </>
    );
};

export default PrincipalPage;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = ({ username, profilePicture }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socket = io('http://localhost:4000'); // Change the URL if your server is hosted elsewhere

    useEffect(() => {
        // Listen for incoming messages
        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Clean up the connection on unmount
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    // Function to send a message
    const sendMessage = () => {
        if (input.trim() !== '') {
            const newMessage = {
                text: input,
                sender: username,
                profilePicture: profilePicture // Include profilePicture in the message object
            };
            socket.emit('message', newMessage);
            setMessages(prevMessages => [...prevMessages, newMessage]); // Display sent message locally
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div>
            {/* Display messages */}
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.profilePicture && <img src={message.profilePicture} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />} {/* Display profile picture if available */}
                        {message.sender === username ? `${username}: ` : `${message.sender}: `}{message.text}
                    </div>
                ))}
            </div>
            {/* Input field and send button */}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;

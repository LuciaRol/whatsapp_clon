import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import * as emojione from 'emojione';

const Chat = ({ username, profilePicture }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const [currentRoom, setCurrentRoom] = useState('General'); // Default chat room
    const socket = io('chat-lucia.vercel.app:4000');
    
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socket.on('typing', (user) => {
            setIsTyping(true);
            setTypingUser(user);
            setTimeout(() => {
                setIsTyping(false);
                setTypingUser('');
            }, 2000);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket, currentRoom]);

    const sendMessage = () => {
        if (input.trim() !== '') {
            const newMessage = {
                text: input,
                sender: username,
                profilePicture: profilePicture,
                room: currentRoom
            };
            socket.emit('message', newMessage);
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInput('');
        }
    };

    const sendEmoji = (emoji) => {
        const newMessage = {
            text: emoji,
            sender: username,
            profilePicture: profilePicture,
            room: currentRoom
        };
        socket.emit('message', newMessage);
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const notifyTyping = () => {
        socket.emit('typing', username);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const emojis = [
        ':smile:',
        ':heart:',
        ':thumbsup:',
        ':joy:',
        ':rocket:',
        ':fire:',
        ':star:',
        ':pizza:',
        ':sun_with_face:',
        ':camera:'
    ];

    // Object to map each room to a background color
    const roomColors = {
        'General': '#f0f0f0',
        'Memes de gatos': '#e0f7fa',
        'Juegos de mesa': '#e8eaf6',
        'Cómics': '#f8bbd0',
        'Programación': '#dcedc8'
    };

    // Function to switch chat rooms
    const changeRoom = (room) => {
        setCurrentRoom(room);
        setMessages([]); // Clear messages when switching rooms
    };

    return (
        <div className="chat-container">
            <div className="room-selector">
                <label>Canales disponibles: </label>
                {Object.keys(roomColors).map(room => (
                    <button key={room} className="btn-chat" onClick={() => changeRoom(room)}>{room}</button>
                ))}
            </div>
            <div className="chat-messages" style={{ backgroundColor: roomColors[currentRoom] }}>
                {messages.filter(message => message.room === currentRoom).map((message, index) => (
                    <div className="message" key={index}>
                        {message.profilePicture && <img src={message.profilePicture} alt="Profile" />}
                        <span className="message-text">{message.sender === username ? `${username}: ` : `${message.sender}: `}<span dangerouslySetInnerHTML={{ __html: emojione.shortnameToImage(message.text) }} /></span>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        notifyTyping();
                    }}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
            <div className="emoji-container">
                <button className="btn-chat" onClick={() => setShowEmojis(!showEmojis)}>Emoji</button>
                {showEmojis && (
                    <div>
                        {emojis.map((emoji, index) => (
                            <span className="emoji" key={index} onClick={() => sendEmoji(emoji)} dangerouslySetInnerHTML={{ __html: emojione.shortnameToImage(emoji) }} />
                        ))}
                    </div>
                )}
            </div>
            {isTyping && <div className="typing-indicator">{typingUser} está escribiendo...</div>}
            <div className="room-info">Estás en la sala {currentRoom}</div>
        </div>
    );
};

export default Chat;

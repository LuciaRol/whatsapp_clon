import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import * as emojione from 'emojione';

const Chat = ({ username, profilePicture }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const socket = io('http://localhost:4000');

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
    }, [socket]);

    const sendMessage = () => {
        if (input.trim() !== '') {
            const newMessage = {
                text: input,
                sender: username,
                profilePicture: profilePicture
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
            profilePicture: profilePicture
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

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
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
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className="emoji-container">
                <button onClick={() => setShowEmojis(!showEmojis)}>Emoji</button>
                {showEmojis && (
                    <div>
                        {emojis.map((emoji, index) => (
                            <span className="emoji" key={index} onClick={() => sendEmoji(emoji)} dangerouslySetInnerHTML={{ __html: emojione.shortnameToImage(emoji) }} />
                        ))}
                    </div>
                )}
            </div>
            {isTyping && <div className="typing-indicator">{typingUser} está escribiendo...</div>}
        </div>
    );
};

export default Chat;

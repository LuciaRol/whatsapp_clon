import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import * as emojione from 'emojione';

const Chat = ({ username, profilePicture }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showEmojis, setShowEmojis] = useState(false); // Estado para controlar la visibilidad de la matriz de emojis
    const socket = io('http://localhost:4000'); // Cambia la URL si tu servidor está alojado en otro lugar

    useEffect(() => {
        // Escucha los mensajes entrantes
        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Limpia la conexión al desmontar
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    // Función para enviar un mensaje
    const sendMessage = () => {
        if (input.trim() !== '') {
            const newMessage = {
                text: input,
                sender: username,
                profilePicture: profilePicture // Incluye profilePicture en el objeto de mensaje
            };
            socket.emit('message', newMessage);
            setMessages(prevMessages => [...prevMessages, newMessage]); // Muestra el mensaje enviado localmente
            setInput('');
        }
    };

    // Función para enviar un emoji
    const sendEmoji = (emoji) => {
        const newMessage = {
            text: emoji,
            sender: username,
            profilePicture: profilePicture
        };
        socket.emit('message', newMessage);
        setMessages(prevMessages => [...prevMessages, newMessage]); // Muestra el emoji enviado localmente
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Matriz de diez emojis
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
        // Agrega más emojis según sea necesario
    ];

    return (
        <div>
            {/* Muestra los mensajes */}
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.profilePicture && <img src={message.profilePicture} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />} {/* Muestra la imagen de perfil si está disponible */}
                        {message.sender === username ? `${username}: ` : `${message.sender}: `}
                        <span dangerouslySetInnerHTML={{ __html: emojione.shortnameToImage(message.text) }} />
                    </div>
                ))}
            </div>
            {/* Campo de entrada y botón de enviar */}
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            
            {/* Botón para mostrar la matriz de emojis */}
            <div>
                <button onClick={() => setShowEmojis(!showEmojis)}>Emoji</button>
            </div>
            {/* Mostrar matriz de emojis si showEmojis es verdadero */}
            {showEmojis && (
                <div>
                    {emojis.map((emoji, index) => (
                        <span key={index} onClick={() => sendEmoji(emoji)} style={{ cursor: 'pointer' }} dangerouslySetInnerHTML={{ __html: emojione.shortnameToImage(emoji) }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Chat;

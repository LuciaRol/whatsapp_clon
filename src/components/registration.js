import React, { useState } from 'react';
import io from 'socket.io-client';
import gatoFeliz from '../img/gato-feliz.jpg';
import gatoGrunon from '../img/gato-grunon.jpg';
import gato from '../img/gato.jpg';

const Registration = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [status, setStatus] = useState('');
    const socket = io('http://localhost:4000');

    const handleRegistration = () => {
        if (username.trim() !== '' && profilePicture && status) {
            onRegister(username, profilePicture, status);
            // Emit registration data to the server
            socket.emit('register', { username, profilePicture, status });
        }
    };

    const handlePictureChange = (selectedPicture) => {
        setProfilePicture(selectedPicture);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegistration();
        }
    };

    return (
        <div className='registro-container'>
            <h2>Registra tu usuario</h2>
            <div>
                <label>Escoge un apodo:</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
            />
            </div>
            {/* fotos predeterminadas */}
            <div>
                <label>Escoge un avatar:</label>
                <div>
                    <input
                        type="radio"
                        name="profilePicture"
                        value={gatoFeliz}
                        onChange={() => handlePictureChange(gatoFeliz)}
                    />
                    <img src={gatoFeliz} alt="Gato Feliz" style={{ maxWidth: '100px' }} />
                </div> 

                <div>
                    <input
                        type="radio"
                        name="profilePicture"
                        value={gatoGrunon}
                        onChange={() => handlePictureChange(gatoGrunon)}
                    />
                    <img src={gatoGrunon} alt="Gato Grunon" style={{ maxWidth: '100px' }} />
                </div>

                <div>
                    <input
                        type="radio"
                        name="profilePicture"
                        value={gato}
                        onChange={() => handlePictureChange(gato)}
                    />
                    <img src={gato} alt="Gato" style={{ maxWidth: '100px' }} />
                </div>
            </div>

            {/* sbubir foto propia como avatar */}
            <div>
                <label>O sube un avatar propio:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {/* elegir estado */}
            <div>
                <label>Elige estado:</label>
                <select value={status} onChange={handleStatusChange}>
                    <option value="Happy">Happy</option>
                    <option value="Grumpy">Grumpy</option>
                    <option value="Neutral">Neutral</option>
                </select>
                
            </div>
            <button onClick={handleRegistration}>Entra ya a Chatt-ON!</button>
        </div>
    );
};

export default Registration;

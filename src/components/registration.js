import React, { useState } from 'react';
import gatoFeliz from '../img/gato-feliz.jpg';
import gatoGrunon from '../img/gato-grunon.jpg';
import gato from '../img/gato.jpg';

const Registration = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [status, setStatus] = useState('');

    const handleRegistration = () => {
        if (username.trim() !== '' && profilePicture && status) {
            onRegister(username, profilePicture, status);
        }
    };

    const handlePictureChange = (selectedPicture) => {
        setProfilePicture(selectedPicture);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegistration();
        }
    };

    return (
        <div>
            <h2>Register Your Username</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
            />
            <div>
                <label>
                    <input
                        type="radio"
                        name="profilePicture"
                        value={gatoFeliz}
                        onChange={() => handlePictureChange(gatoFeliz)}
                    />
                    
                    <img src={gatoFeliz} alt="Gato Feliz" style={{ maxWidth: '100px' }} />
                </label>
                <label>
                    <input
                        type="radio"
                        name="profilePicture"
                        value={gatoGrunon}
                        onChange={() => handlePictureChange(gatoGrunon)}
                    />
                   
                    <img src={gatoGrunon} alt="Gato Grunon" style={{ maxWidth: '100px' }} />
                </label>
                <label>
                    <input
                        type="radio"
                        name="profilePicture"
                        value={gato}
                        onChange={() => handlePictureChange(gato)}
                    />
                   
                    <img src={gato} alt="Gato" style={{ maxWidth: '100px' }} />
                </label>
            </div>
            <div>
                <label>
                    Select Status:
                    <select value={status} onChange={handleStatusChange}>
                        <option value="">Select status</option>
                        <option value="Happy">Happy</option>
                        <option value="Grumpy">Grumpy</option>
                        <option value="Neutral">Neutral</option>
                    </select>
                </label>
            </div>
            <button onClick={handleRegistration}>Register</button>
        </div>
    );
};

export default Registration;

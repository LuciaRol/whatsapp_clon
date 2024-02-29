import React, { useState } from 'react';
import io from 'socket.io-client';
import gatoFeliz from '../img/gato-feliz.jpg';
import gatoGrunon from '../img/gato-grunon.jpg';
import gato from '../img/gato.jpg';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../firebaseconfig';



const Registration = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [status, setStatus] = useState('');
    const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://whatsapp-clon-1.vercel.app');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    

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

    const handleRegisterWithGoogle = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Extract user's name and picture from Google authentication result
            const { displayName, photoURL } = user;
    
            // Set username to Google's name
            setUsername(displayName);
    
            // Set profile picture to Google's picture
            setProfilePicture(photoURL);
    
            // Set status to "Happy"
            setStatus("Happy");
    
            // Automatically handle registration
            handleRegistration();
        } catch (error) {
            setError(error.message);
        }
    };

    
const handleRegisterWithFacebook = async () => {
    const auth = getAuth(app);
    const provider = new FacebookAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Extract user's name and picture from Facebook authentication result
        const { displayName, photoURL } = user;

        // Set username to Facebook's name
        setUsername(displayName);

        // Set profile picture to Facebook's picture
        setProfilePicture(photoURL);

        // Set status to "Happy"
        setStatus("Happy");

        // Automatically handle registration
        handleRegistration();
    } catch (error) {
        setError(error.message);
    }
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
        <>
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
                <label>Estado:</label>
                <select value={status} onChange={handleStatusChange}>
                    <option value="Mood" selected>Elige tu mood</option>
                    <option value="Happy">Happy</option>
                    <option value="Grumpy">Grumpy</option>
                    <option value="Neutral">Neutral</option>
                </select>
                
            </div>
            
            {/* Google Sign-In Button */}
            <button onClick={handleRegisterWithGoogle}>Regístrate con Google</button>
            <button onClick={handleRegisterWithFacebook}>Regístrate con Facebook</button>
            <button onClick={handleRegistration}>Entra ya a Chatt-ON!</button>
          
        </div>
        </>
    );
};

export default Registration;

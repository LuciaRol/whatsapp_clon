// App.js
import React, { useState } from 'react';
import Registration from './components/registration';
import PrincipalPage from './components/PrincipalPage';
import Chat from './components/Chat';
import './App.css';
import Header from './components/Header';

const App = () => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [registrationCompleted, setRegistrationCompleted] = useState(false);

    const handleRegister = (username, profilePicture) => {
        setUsername(username);
        setProfilePicture(profilePicture);
        setRegistrationCompleted(true);
    };

    return (
        
        <div className="app"> {/* Parent container with flex display */}
        <Header/>
            <div  style={{ display: 'flex' }}>
                <div style={{ flex: '1', marginRight: '10px' }}> {/* Left side */}
                    {!registrationCompleted ? (
                        <div className="container1"><Registration onRegister={handleRegister} /></div>
                    ) : (
                        <div className="container2"><PrincipalPage username={username} profilePicture={profilePicture} /></div>
                    )}
                </div>
                <div style={{ flex: '2', marginLeft: '10px' }}> {/* Right side */}
                    {!registrationCompleted && <div className='image-container'><img src="https://i.pinimg.com/originals/74/34/57/743457785e7543fd62c51e59dcf853d9.gif" alt="Gatito" /></div>}
                    {registrationCompleted && <Chat username={username} profilePicture={profilePicture} />}
                </div>
            </div>
        </div>
    );
    
};

export default App;

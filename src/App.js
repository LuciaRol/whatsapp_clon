// App.js
import React, { useState } from 'react';
import Registration from './components/registration';
import PrincipalPage from './components/PrincipalPage';
import Chat from './components/Chat';

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
        <div style={{ display: 'flex' }}> {/* Parent container with flex display */}
            <div style={{ flex: '1', marginRight: '10px' }}> {/* Left side */}
                {!registrationCompleted ? (
                    <Registration onRegister={handleRegister} />
                ) : (
                    <PrincipalPage username={username} profilePicture={profilePicture} />
                )}
            </div>
            <div style={{ flex: '1', marginLeft: '10px' }}> {/* Right side */}
                {registrationCompleted && <Chat username={username} profilePicture={profilePicture} />}
            </div>
        </div>
    );
};

export default App;

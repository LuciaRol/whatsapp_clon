import React, { useState } from 'react';
import Registration from './components/registration';
import Chat from './components/Chat';

const App = () => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // Initialize profilePicture as null

    const handleRegister = (username, profilePicture) => {
        setUsername(username);
        setProfilePicture(profilePicture); // Set the profile picture
    };

    return (
        <div>
            {!username ? <Registration onRegister={handleRegister} /> : <Chat username={username} profilePicture={profilePicture} />} {/* Pass profilePicture to Chat component only if it's defined */}
        </div>
    );
};

export default App;

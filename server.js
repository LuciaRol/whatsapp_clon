const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware for file uploads
app.use(fileUpload());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io event handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handling incoming messages
    socket.on('message', (data) => {
        console.log('Message received:', data);
        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    // Handling disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Handle user registration
app.post('/register', (req, res) => {
    const { username } = req.body;
    const { profilePicture } = req.files;

    // Save profile picture to uploads folder
    if (profilePicture) {
        const fileName = `${Date.now()}-${profilePicture.name}`;
        profilePicture.mv(path.join(__dirname, 'uploads', fileName), (err) => {
            if (err) {
                console.error('Error saving profile picture:', err);
                res.status(500).send('Error saving profile picture');
            } else {
                // Send the URL of the uploaded image to the client along with the username
                const imageUrl = `http://localhost:4000/uploads/${fileName}`;
                res.json({ username, profilePicture: imageUrl });
            }
        });
    } else {
        // If no profile picture was uploaded, send only the username
        res.json({ username });
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

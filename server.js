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

// Define an array to store connected users' information
const connectedUsers = [];

// Middleware for file uploads
app.use(fileUpload());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io event handling
io.on('connection', (socket) => {
    console.log('New client connected');

    /// Handling user registration
    socket.on('register', ({ username, profilePicture, status }) => {
        console.log('Received registration data:', username, profilePicture, status);
        
        // Save user information
        connectedUsers.push({ id: socket.id, username, profilePicture, status });
        console.log('User registered:', username);
        console.log('Connected users:', connectedUsers);
        
        // Emit updated list of connected users to all clients
        io.emit('connectedUsersUpdate', connectedUsers.map(user => user.username));
        
        // Emit socket ID back to client for future reference
        socket.emit('registrationSuccess', socket.id);
    });

    // Handling incoming messages
    socket.on('message', (data) => {
        console.log('Message received:', data);
        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

   // Handling disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Remove the disconnected user from the array
        const index = connectedUsers.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            // Emit updated list of connected users to all clients
            io.emit('connectedUsersUpdate', connectedUsers.map(user => user.username));
        }
    });

    // Handle user status update
    socket.on('updateStatus', (status) => {
        const user = connectedUsers.find(u => u.id === socket.id);
        if (user) {
            user.status = status;
            console.log('User status updated:', status);
        }
    });
});

// Handle user registration endpoint
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
                // Send user registration data to the client
                io.to(req.socketId).emit('registrationComplete', { username, profilePicture: imageUrl });
                // Store user information on the server
                connectedUsers.push({ id: req.socketId, username, profilePicture: imageUrl, status: 'online' });
                res.json({ username, profilePicture: imageUrl });
            }
        });
    } else {
        // If no profile picture was uploaded, send only the username
        // Send user registration data to the client
        io.to(req.socketId).emit('registrationComplete', { username });
        // Store user information on the server
        connectedUsers.push({ id: req.socketId, username, status: 'online' });
        res.json({ username });
    }
});

// Handle user status update endpoint
app.post('/updateStatus', (req, res) => {
    const { socketId, status } = req.body;
    // Update user status
    const user = connectedUsers.find(u => u.id === socketId);
    if (user) {
        user.status = status;
        res.json({ status: 'updated' });
    } else {
        res.status(404).send('User not found');
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
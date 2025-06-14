require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online-judge',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    dockerConfig: {
        socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock'
    }
}; 
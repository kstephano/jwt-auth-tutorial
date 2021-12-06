require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const posts = require('./data/posts');
const { authenticateToken } = require('./middleware/auth');

const server = express();

server.use(express.json()); // Allows server to use JSON from the body that gets passed up to it inside of requests

server.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

module.exports = server;
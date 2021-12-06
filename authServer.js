require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const posts = require('./data/posts');
const { authenticateToken } = require('./middleware/auth');
const { generateAccessToken } = require('./helpers/auth');

const server = express();

server.use(express.json()); // Allows server to use JSON from the body that gets passed up to it inside of requests

let refreshTokens = [];

server.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

server.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401); // check if refreshToken is null

    // check if refreshToken is still valid or has been removed
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    
    // verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    })
});

server.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

server.post('/login', (req, res) => {
    // Authenticate User

    const username = req.body.username;
    const user = { name: username }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

module.exports = server;
const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

exports.githubAuth = (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo,user&prompt=login`;
    res.redirect(githubAuthUrl);
};

exports.githubCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        const { data } = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        if (!data.access_token) {
            return res.status(400).send('Failed to obtain access token');
        }

        res.redirect(`https://www.propelx.club/dashboard?access_token=${data.access_token}`);
    } catch (error) {
        console.error('GitHub authentication error:', error);
        res.status(500).send('Authentication failed');
    }
};
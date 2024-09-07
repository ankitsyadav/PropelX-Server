const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

exports.githubAuth = (req, res) => {
    const githubAuthUrl = 'https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo,user&prompt=login';
    res.redirect(githubAuthUrl);
};

exports.githubCallback = async (req, res) => {
    const code = req.query.code;

    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = response.data.access_token;
        // Redirect to the frontend with the access token
        res.redirect(`https://www.propelx.club/dashboard?access_token=${accessToken}`);
    } catch (error) {
        res.status(500).send('Authentication failed');
    }
};
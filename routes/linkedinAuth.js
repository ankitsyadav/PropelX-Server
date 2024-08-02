// File: routes/linkedinAuth.js
const express = require("express");
const axios = require("axios");
const logger = require("../config/logger");
require("dotenv").config();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTHORIZATION_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const SCOPE = "openid profile email";
const STATE = "some_random_state"; // should be a securely generated random string

const linkedinAuthUrl = `${AUTHORIZATION_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&state=${STATE}&scope=${encodeURIComponent(SCOPE)}`;

const router = express.Router();

router.get("/auth/linkedin", (req, res) => {
  logger.info("Starting LinkedIn authentication");
  res.redirect(linkedinAuthUrl);
});

router.get("/auth/linkedin/callback", async (req, res) => {
  const authorizationCode = req.query.code;

  try {
    const response = await axios.post(TOKEN_URL, null, {
      params: {
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;
    logger.info(`Access Token: ${accessToken}`);

    // Store the access token in the session or database
    req.session.accessToken = accessToken;

    // Fetch user information
    const userInfoResponse = await axios.get(USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    logger.info(
      `User Info Response Data: ${JSON.stringify(userInfoResponse.data)}`
    );

    res.json({
      user: userInfoResponse.data,
    });
  } catch (error) {
    if (error.response) {
      logger.error(
        `Error fetching user information: ${error.response.status} - ${error.response.statusText}`
      );
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    } else {
      logger.error(`Error fetching user information: ${error.message}`);
    }
    res.status(500).send("Error fetching user information");
  }
});

module.exports = router;

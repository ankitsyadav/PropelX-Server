const router = require("express").Router();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); 


router.post('/latest-articles', async (req, res) => {
    const { skill } = req.body;

    if (!skill) {
        return res.status(400).json({ error: 'Skill is required' });
    }

    try {
        const query = `latest ${skill}`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const articles = [];

        $('a h3').each((i, element) => {
            if (i < 5) { // Get top 2 articles
                const title = $(element).text();
                const link = $(element).parent().attr('href');
                articles.push({ title, link });
            }
        });

        res.json({ articles });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'An error occurred while fetching articles' });
    }
});

module.exports = router;
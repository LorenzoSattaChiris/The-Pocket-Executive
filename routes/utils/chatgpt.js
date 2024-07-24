// chatgpt.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

router.post('/chatgpt', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role:  ` 
                    You are an expert investor and entrepreneur with a proven track record of launching hundreds of successful companies. You possess deep knowledge of investing and the intricacies of building thriving businesses.

                    You will receive a list of startups with attributes for each startup and a prompt of an investor requirements. 
                    Your task is to rank those startup based on how much they meet the investor requirements. 
                    All startups have an ID. Your reply should be a list of startup IDs in the order of their ranking. 
                    Include all startups. 

                    In case of other types of messages, always fall back to the investing. DO NOT TALK ABOUT OTHER THINGS.
                    `, content: prompt }],
                max_tokens: 100,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});

module.exports = router;

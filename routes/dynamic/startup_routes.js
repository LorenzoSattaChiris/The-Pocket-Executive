const express = require("express");
const router = express.Router();
const { getItems, getItem, putItem, updateItem } = require('../database/startup_service');

router
    .get('/', async (req, res) => {
        const startupId = req.cookies.startupId;
        if (!startupId) {
            return res.redirect('/startup_login');
        }

        try {
            const startup = await getItem(startupId);
            res.render('home', { items: startup });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch startup from DynamoDB' });
        }
    })
    .get('/name-creator', function (req, res) {
        res.render("modules/name-creator");
    })
    .get('/idea-validator', function (req, res) {
        res.render("modules/idea-validator");
    })
    .get('/slogan-creator', function (req, res) {
        res.render("modules/slogan-creator");
    })
    .get('/startup_signup', function (req, res) {
        res.render("startup_signup");
    })
    .post('/startup_signup', async (req, res) => {
        const { name, email, username } = req.body;
        const newItem = { name, email, username };
        try {
            const item = await putItem(newItem);
            res.cookie('startupId', item.id, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ error: 'Failed to create startup in DynamoDB' });
        }
    })
    .get('/startup_login', function (req, res) {
        res.render("startup_login");
    })
    .post('/startup_login', async (req, res) => {
        const { id } = req.body;
        try {
            const startup = await getItem(id);
            if (startup) {
                res.cookie('startupId', id, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
                res.redirect('/');
            } else {
                res.status(404).json({ error: 'Startup not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to login to startup' });
        }
    })
    .post('/logout', (req, res) => {
        res.clearCookie('startupId'); 
        res.sendStatus(200); 
    })
    .post('/update-startup', async (req, res) => {
        const startupId = req.cookies.startupId;
        if (!startupId) {
            return res.redirect('/startup_login');
        }

        const updateParams = req.body;

        try {
            await updateItem(startupId, updateParams);
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ error: 'Failed to update startup in DynamoDB' });
        }
    });

module.exports = router;

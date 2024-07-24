// investor_routes.js
const express = require("express");
const router = express.Router();
const { createInvestor, getInvestor, getStartups, getStartupById } = require('../database/investor_service');

router
    .get('/dashboard', async (req, res) => {
        res.redirect('/');
    })
    .get('/', async (req, res) => {
        const investorId = req.cookies.investorId;
        if (!investorId) {
            return res.redirect('/investor_login');
        }
        try {
            const investor = await getInvestor(investorId);
            res.render('dashboard', { items: investor });
        } catch (error) {
            console.error("Error fetching investor from DynamoDB", error);
            res.status(500).json({ error: 'Failed to fetch investor from DynamoDB' });
        }
    })
    .get('/investor_signup', function (req, res) {
        const investorId = req.cookies.investorId;
        if (investorId) {
            return res.redirect('/');
        }
        res.render("investor_signup");
    })
    .post('/investor_signup', async (req, res) => {
        const { name, email, username } = req.body;
        const newItem = { name, email, username };
        try {
            const item = await createInvestor(newItem);
            res.cookie('investorId', item.id, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.redirect('/');
        } catch (error) {
            console.error("Error creating investor in DynamoDB", error);
            res.status(500).json({ error: 'Failed to create investor in DynamoDB' });
        }
    })
    .get('/investor_login', function (req, res) {
        const investorId = req.cookies.investorId;
        if (investorId) {
            return res.redirect('/');
        }
        res.render("investor_login");
    })
    .post('/investor_login', async (req, res) => {
        const { id } = req.body;
        try {
            const investor = await getInvestor(id);
            if (investor) {
                res.cookie('investorId', id, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
                res.redirect('/');
            } else {
                res.status(404).json({ error: 'Investor not found' });
            }
        } catch (error) {
            console.error("Error fetching investor from DynamoDB", error);
            res.status(500).json({ error: 'Failed to login to investor' });
        }
    })
    .post('/logout', (req, res) => {
        res.clearCookie('investorId'); 
        res.sendStatus(200); 
    })
    .get('/survey', async (req, res) => {
        res.render("survey");
    })
    .get('/my-startups', async (req, res) => {
        res.render("my_startups");
    })
    .get('/startups', async (req, res) => {
        res.render("startups");
    })
    .get('/swipe', async (req, res) => {
        res.render("swipe");
    })
    .post('/update-investor', async (req, res) => {
        const investorId = req.cookies.investorId;
        if (!investorId) {
            return res.redirect('/investor_login');
        }

        const updateParams = req.body;

        try {
            await updateItem(investorId, updateParams);
            res.redirect('/');
        } catch (error) {
            console.error("Error updating investor in DynamoDB", error);
            res.status(500).json({ error: 'Failed to update investor in DynamoDB' });
        }
    });

module.exports = router;

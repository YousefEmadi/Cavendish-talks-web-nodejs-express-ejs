// const { localsName } = require("ejs");
const express = require("express");
const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (params) => {

    const validate =     [
        check('name').trim().isLength({ min: 3 }).escape().withMessage('Name is required at least 3 characters long'),
        check('email').trim().isEmail().normalizeEmail().withMessage('Email is required and must be a valid email address'),
        check('title').trim().isLength({ min: 3 }).escape().withMessage('Title is required at least 3 characters long'),
        check('message').trim().isLength({ min: 10 }).escape().withMessage('Message is required at least 10 characters long'),

    ];

    router.get('/', async (req, res) => {
        const errors = req.session.feedbackTray ? req.session.feedbackTray.errors : false;
        const successMessage = req.session.feedbackTray ? req.session.feedbackTray.successMessage : false;
        req.session.feedbackTray = null; // reset error after displaying
        const allFeedbacks = await params.feedbackService.getList();
        res.render('layout', { pageTitle: 'Feedback', template: 'feedbacks', allFeedbacks, errors , successMessage});
    });

    router.get('/api', async (req, res, next) => {
        try {
            const allFeedbacks = await params.feedbackService.getList();
            res.status(200).json(allFeedbacks);
        } catch (error) {
            next(error);
        }
    });
    

    router.post('/', 
    validate,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.feedbackTray = {
                errors: errors.array()
            };
            return res.redirect('/feedback');
        }
        req.session.feedbackTray = {successMessage: 'Feedback sent successfuly!'};
        await params.feedbackService.addEntry(req.body.name, req.body.email, req.body.title, req.body.message);
        return res.redirect('/feedback');
    });


    router.post('/api',
    validate,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
            }
            await params.feedbackService.addEntry(req.body.name, req.body.email, req.body.title, req.body.message);
            const feedback = await params.feedbackService.getList();
            return res.status(200).json({ feedback, successMessage: 'Feedback sent successfuly!' });
        } catch (error) {
            return next(error);
        }
    });

    return router;
};

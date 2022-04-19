const express = require("express");
const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = params => {


    router.get('/', async (req, res) => {

        const topSpeakers = await params.speakersService.getList();
        const allArtWorks = await params.speakersService.getAllArtwork();
        res.render('layout', { pageTitle: 'Bienvenue', template: 'index', topSpeakers , allArtWorks });
      });

    // router.get('/speakers', async (req, res) => {
    //     const allSpeakers = await params.speakersService.getList();
    //     const allArtWorks = await params.speakersService.getAllArtwork();
    //     res.render('layout', { pageTitle: 'Speakers', template: 'speakers', allSpeakers , allArtWorks });
    //   });

    router.use('/speakers', speakersRoute(params));
    router.use('/feedback', feedbackRoute(params));
      

    return router;
};



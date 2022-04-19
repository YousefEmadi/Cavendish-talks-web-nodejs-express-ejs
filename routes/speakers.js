const express = require("express");

const router = express.Router();

module.exports = (params) => {

    // const speakersService = params.speakersService;
    const {speakersService} = params;
    router.get('/', async (req, res) => {
        const allSpeakers = await params.speakersService.getList();
        const allArtWorks = await params.speakersService.getAllArtwork();
        res.render('layout', { pageTitle: 'Speakers', template: 'speakers', allSpeakers , allArtWorks });
    });

    router.get('/:shortName', async (req, res) => { 
    const speaker = await speakersService.getSpeaker(req.params.shortName); 
    const allArtWorks = await speakersService.getArtworkForSpeaker(req.params.shortName);
    res.render('layout', { pageTitle: speaker.title , template: 'speakerPage', speaker , allArtWorks });

    });

    
    
    return router;
};

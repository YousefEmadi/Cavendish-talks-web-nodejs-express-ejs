// express server creation

// step 1: create an express app instance
const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const creatError = require("http-errors");
const bodyParser = require("body-parser");

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require("./routes");

const app = express();

// step 2: create a port number for the server to listen on (port 3000 is the default convention)
const port = 3000;

// cookie session
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: ['iuqriuewqriuq', 'oqiueoiuqoiewr']
}));

// create a middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// EJS setup
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));

// local variables
app.locals.siteName = "Cavendish Talks";

app.use( async(req, res, next) => {
    try {
      app.locals.speakerNames = await speakersService.getNames();
      return next(); 
    } catch (error) {
        return next(error);
    }
});

// using a middleware to serve static files in "static" folder
app.use(express.static(path.join(__dirname, "static")));

// step 3: create a route for the server
// deligated to router
app.use(
    '/',
    routes({
    feedbackService,
    speakersService,
    })
);

// if all routes above are not matched, create a 404 error
app.use((req, res, next) => {
    next(creatError(404));
});

// if all routes above are not matched, this middleware will be called
app.use((err, req, res, next) => {
    res.locals.error = err;
    if (err.status === 404) {
        res.status(404).render("error404");
    } else {
        res.status(500).render("500");
    }
    next(err);
});

// step 4: start the server
app.listen(port, () => {
  console.log(`${app.locals.siteName} Back-end server app listening on port ${port}!`);
});

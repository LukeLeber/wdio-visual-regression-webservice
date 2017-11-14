var Express = require('express'),
    BodyParser = require('body-parser'),
    Path = require('path'),
    IndexController = require('./controllers/index'),
    SeleniumStandaloneController = require('./controllers/build/selenium-standalone'),
    BrowserstackController = require('./controllers/build/browserstack');

// Use the Express engine for a simple REST API
var app = Express();

// Don't tell anyone that this is a node.js server
app.disable('x-powered-by');

// A piece of middle-ware to filter out all requests but those 
// originating from localhost (proxied by Apache)
app.use(function(req, res, next) {

    // If the request isn't coming from localhost...
    if(req.ip !== '::ffff:127.0.0.1' && req.ip !== '127.0.0.1') {

        // Access Forbidden
        res.status(403).end();
        return;
    }
    next();
});

// We support URL-encoded POST bodies
app.use(BodyParser.urlencoded({ extended: true })); 


// By now, the only requests coming in are from localhost.
// So we'll just define the handled routes below...

// Simple HTTP/200 with a success message (to let callers know we're online)
app.get('/', function(req, res) {
    IndexController.handle(req, res);
});

// POST request to kick off a selenium-standalone build
app.post('/build/selenium-standalone', function(req, res) {
    SeleniumStandaloneController.handle(req, res);
});

// POST request to kick off a browserstack build
app.post('/build/browserstack', function(req, res) {
    BrowserstackController.handle(req, res);
});

// Start the app.
app.listen(3001);
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

/*
 * Heroku stores the port number as an enviroment variable. 
 * process is an object which stores all system enviroment 
 * variable as a key-value pair If a variable PORT is not define 
 * (e.g. testing locally), port constant will have a value of 3000
 */
const port = process.env.PORT || 3000;

var app = express();

/*
* telling where the partials are
*/
hbs.registerPartials(__dirname + '/views/partials');

/*
* Registering a function to be called inside a hbs file
*/
hbs.registerHelper('getCurrentYear',() => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

/*
* Setting View engine
*/
app.set('view engine','hbs');


/*
* Setting a middleware. In this case, setting a static directory
*/
app.use(express.static(__dirname + '/public'));

/*
* Setting a function middleware
* Next tells Express that the middleware function its done, and can continue with the rest of the code. 
* If no next function appears, the app will stuck in the middleware function. 
*/
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log',log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

/*
 * This middleware doesn't have next method. It means that it will render the maintenance page 
 * despite the url that the user write on the browser, and the site won't do anything else
 * We will use this middleware when the site its on maintenance mode. That's why I will comment it
 * in order to let the service works as it suppose to
 */
/*app.use((req, res, next) => {
    res.render('maintenance.hbs', {
        pageTitle: 'Maintenance'
    });
});*/


/*
* Setting a handler for http request
* arguments:
* - Url (in this expample home url)
* - function that defines what to do when a user visit
* url. The function has two arguments:
*     - req = request
*     - res = respond
*/
app.get('/',(req,res) => {
    res.render('home.hbs',{
        pageTitle: 'Home Page',
        name: 'Francisco Egloff',
        hobbiesList: ['music', 'boardgames']
    })
    //res.send('<h1>Hello Express!<h1>');
    /*.send({
        name: 'Francisco',
        hobbies: [ 'music', 'boardgames']
    });*/
});

app.get('/about', (req,res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
})

app.get('/projects', (req,res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page'
    });
})

app.get('/bad',(req,res) => {
    res.send({
        code : '404',
        errorMessage: 'Error handling request'
    });
})

/*
* To bind the application to a port on our machine (sever),
* and making the app to start listeing
*/
app.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});
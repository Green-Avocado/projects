#!/usr/bin/env node

const ejs = require('ejs');
const express = require('express');
const helmet = require('helmet');
const nocache = require('nocache');
const yargs = require('yargs');



const PORT = 5101;

var allowedHosts = [
    'projects.jasonn.dev'
]



const argv = yargs
    .option('local', {
        alias: 'l',
        description: 'Allow requests to localhost',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.local) {
    console.log(`Running on localhost:${PORT}`);

    allowedHosts = [`localhost:${PORT}`];
}



const app = express();

app.set('view engine', 'ejs');



function serverlog(req, code) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl,
        'Response: (' + code + ')'
    );
}



app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "form-action": ["'self'"],
                "script-src": [
                    "'self'",
                    "ajax.googleapis.com",
                    "cdnjs.cloudflare.com",
                    "maxcdn.bootstrapcdn.com"
                ],
                "style-src": [
                    "'self'",
                    "maxcdn.bootstrapcdn.com"
                ],
            },
        },
    })
);

app.use(nocache());

app.use('*', function(req, res, next) {
    if(allowedHosts.includes(req.get('host'))) {
        next();
    }
    else {
        const res_code = 400;
        serverlog(req, res_code);

        const res_msg = 'Bad Request';
        res.status(res_code);

        res.type('txt').send(res_msg);
        return;
    }
});



app.get('/', function(req, res) {
    const res_code = 200;
    serverlog(req, res_code);

    res.render('pages/index');
    return;
});



app.get('/favicon.ico', function(req, res) {
    res.sendFile('./resources/favicon.ico', { root: __dirname })
    return;
});

app.use('/resources', express.static(__dirname + '/resources'));



app.use('*', function(req, res) {
    const res_code = 404;
    serverlog(req, res_code);

    const res_msg = 'Not found';
    res.status(res_code);

    if(req.accepts('html')) {
        res.sendFile('./resources/404.html', { root: __dirname });
        return;
    }

    if(req.accepts('json')) {
        res.json({ error: res_msg });
        return;
    }

    res.type('txt').send(res_msg);
    return;
});



app.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});


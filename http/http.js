#/usr/bin/env node

const express = require('express');
const proxy = require('express-http-proxy');

const PORT = 5101;

const app = express();



function serverlog(req) {
    console.log(
        new Date,
        'Request: ' + req.protocol + '://' + req.get('host') + req.originalUrl
    );
}



app.use('*', function(req, res, next) {
    serverlog(req);
    next();
});



app.use('/cctweaked', proxy('localhost:5110'));

app.use('*', (req, res) => res.sendStatus(404));



app.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});


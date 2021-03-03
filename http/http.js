#!/usr/bin/env node

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

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



const wsProxy = createProxyMiddleware('/socket/', {
    target: 'http://projects.jasonn.dev',
    router: {
        '/ubc-cctweaked': 'http://localhost:5110'
    },
    changeOrigin: true,
    ws: true
});

app.use(wsProxy);




app.use('*', (req, res) => res.sendStatus(404));



const server = app.listen(PORT);
server.on('upgrade', wsProxy.upgrade);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});


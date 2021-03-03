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



const ubcCctweakedProxy = createProxyMiddleware('/ubc-cctweaked', { target: 'http://localhost:5110', changeOrigin: true, ws: true });
app.use(ubcCctweakedProxy);

app.use('*', (req, res) => res.sendStatus(404));



app.listen(PORT);

process.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});


#!/usr/bin/env node

const http = require('http');
const readline = require('readline')
const WebSocketServer = require('websocket').server;

const PORT = 5110;



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const server = http.createServer(function(req, res) {
    res.writeHead(404);
    res.end();
});



const wss = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});



wss.on('request', function(req) {
    var conn = req.accept('basic-cli', req.origin);

    conn.on('message', function(msg) {
        rl.question(msg, answer => {conn.sendUTF(answer)});
    });
});



server.listen(PORT);

rl.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});


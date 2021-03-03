#!/usr/bin/env node

const http = require('http');
const readline = require('readline');
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



var conn = null;

wss.on('request', function(req) {
    if(!conn) {
        conn = req.accept();
        console.log("\nCONNECTION OPENED\n");
    }

    conn.on('message', function(msg) {
        console.log(msg.utf8Data);
    });

    conn.on('close', function(reason, desc) {
        console.log("\nCONNECTION CLOSED\n");
        conn = null;
    });
});


rl.on('line', function(input) {
    if(conn) {
        conn.sendUTF(input);
    }
});



server.listen(PORT);

rl.on('SIGINT', function() {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)\n');
    process.exit();
});


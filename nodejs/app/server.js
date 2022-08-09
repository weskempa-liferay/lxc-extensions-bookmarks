"use strict"

const http = require("http");
const fs = require('fs').promises;

const port = 8080;
const host = "0.0.0.0";

const requestListener = function (req, res) {
    fs.readFile(__dirname + "/react/build/static/js/main.js")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
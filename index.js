var express = require('express');
var retrieve = require("./src/retriever");
var app = express();

var childProcess = require("child_process"),
    _finalizedData = null,
    _httpRequestArray = [
        "http://w1.weather.gov/xml/current_obs/KAEJ.xml",
        "http://w1.weather.gov/xml/current_obs/KDEN.xml",
        "http://w1.weather.gov/xml/current_obs/KLMO.xml",
        "http://w1.weather.gov/xml/current_obs/KMYP.xml"];

var data = {
    "start":true,
    "interval": 5000,/* Change this after testing. Recommend 60 * 60 * 1000 */
    "content": _httpRequestArray
}

var init = function(){
    console.log("index.js: initialization starting");
    this._retrieveChild = childProcess.fork("./src/retriever");

    this._retrieveChild.on('message', function(msg){
        console.log("index.js: recv'd message from background process.");
        _finalizedData = " " + msg.content;
    }.bind(this))

    this._retrieveChild.send(data);
}()

app.get('/', function(req, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(_finalizedData);
    res.end();
});

app.listen(3000);
console.log("Listening on port 3000");

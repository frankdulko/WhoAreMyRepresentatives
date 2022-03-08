
const express = require('express');
const bodyParser = require("body-parser")
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended:true
}));

var address;

app.get("/", (request, response) => {
    response.sendFile("index.html");
});

app.get("/api", (request, response) => {
    response.send(address);
});

app.post("/", (request, response) => {
    var street = request.body.street1;
    var city = request.body.city;
    var state = request.body.state;
    var zip = request.body.zip;

    address = street + " " + city + " " + state + " " + zip;
});

app.listen(3030, () => {
    console.log("check out the magic at: http://localhost:3030")
})

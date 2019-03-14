
/*console.log("Hello word!!!");
var express = require("express");
var app = express();

app.listen(8080);*/
const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
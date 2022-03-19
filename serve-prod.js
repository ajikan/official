const express = require('express');
const server = express();
server.use('/official', express.static(`${__dirname}/dist`));

server.listen(3000);
console.log('http://localhost:3000/official');

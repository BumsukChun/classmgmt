const express = require('express');
const winston = require('./config/winston');
const port = process.env.PORT || 3000;

const app = express();


// Routers

// Server listening
const server = app.listen(port, () => {
    winston.info(`node server is running at port : ${port}`);
});
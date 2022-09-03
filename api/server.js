require('dotenv').config({ path: '../pitjarus.env' });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const APP_ENV = process.env.APP_ENV || 'DEV';
const port = process.env.PORT || 10000;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '20mb' }));

// API Route
const ReportRoute = require('./route/ReportRoute');
app.use('/pitjarus-api', ReportRoute);

// Apps Port Listen
app.listen(port, () => {
    console.log('Env', 'App Environment is ' + `${APP_ENV}`);
    console.log('Listen', 'App Listening at localhost:' + port);
    console.log('DB', 'App is connecting to DB at ' + `${DB_HOST}:${DB_PORT}`);
});
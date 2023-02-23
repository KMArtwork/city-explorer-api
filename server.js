'use strict';

const express = require('express'); //loads express library from node_modules
const cors = require('cors');
const app = express(); // creates a singleton
require('dotenv').config();
const axios = require('axios');

const getWeatherData = require('./lib/weather');
const getMovieData = require('./lib/movies');

const PORT = process.env.PORT;

app.use(cors());

app.get('/weather', (request, response) => {
  getWeatherData(request, response);
} )

app.get('/movies', async (request, response) => {
  getMovieData(request, response);
})

app.listen(PORT, () => {
  console.log('Server is up');
})
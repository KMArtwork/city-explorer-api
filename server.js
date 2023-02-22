'use strict';

const express = require('express'); //loads express library from node_modules
const cors = require('cors');
const app = express(); // creates a singleton
require('dotenv').config();

const weatherData = require('./data/weather.json');

const PORT = process.env.PORT;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }

}

app.use(cors());

app.get('/weather', (request, response) => {
  let queryMatch = weatherData.find(element => {
    if (request.query.city.toLowerCase().includes(element.city_name.toLowerCase())  
        || (request.query.lat === element.lat && request.query.lon === element.lon)) {
      return element;
    }
  })

    if (queryMatch){
      let forecastArr = [];
      queryMatch.data.forEach(element => {
        forecastArr.push(new Forecast(
          element.datetime,
          `Expect ${element.weather.description} | Low of ${element.low_temp} | High of ${element.high_temp}`))
      })
      response.status(200).send(forecastArr);
    } 
    else if(!queryMatch) {
      response.status(404).send('No results found');
    }
})

app.listen(PORT, () => {
  console.log('Server is up');
})
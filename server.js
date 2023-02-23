'use strict';

const express = require('express'); //loads express library from node_modules
const cors = require('cors');
const app = express(); // creates a singleton
require('dotenv').config();
const axios = require('axios');

const PORT = process.env.PORT;
const WEATHERBIT_ACCESS_KEY = process.env.WEATHERBIT_ACCESS_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }

}

app.use(cors());


app.get('/weather', async (request, response) => {
  //request.query.city | request.query.lat | request.query.lon
  
  try {
    let proxyRequest = {
      url: `https://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.lat}&lon=${request.query.lon}&city=${request.query.city}&key=${WEATHERBIT_ACCESS_KEY}&days=7`,
      method: 'GET'
    }

    let proxyResponse = [];
    
    axios(proxyRequest)
      .then((axiosResponse) => {
        axiosResponse.data.data.forEach(element => {
          proxyResponse.push(new Forecast(
            element.datetime, 
            `Expect ${element.weather.description} | High of ${element.high_temp} | Low of ${element.low_temp}`));
        });
        response.status(200).send(proxyResponse);
      })

  } catch (err) {
    response.status(500).send('Could not complete proxy request to weatherbit');
  }

})

app.listen(PORT, () => {
  console.log('Server is up');
})
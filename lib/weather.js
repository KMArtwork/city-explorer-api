'use strict';

const axios = require('axios');

let cache = require('../data/cache.js');

const WEATHERBIT_ACCESS_KEY = process.env.WEATHERBIT_ACCESS_KEY;

class Forecast {
  constructor(date, description, low, high, icon) {
    this.date = date;
    this.description = description;
    this.low = low;
    this.high = high;
    this.icon = icon;
  }
}


const getWeatherData = async (request, response) => {
    //request.query.city | request.query.lat | request.query.lon

    const cacheKey = `${request.query.city}_${request.query.lat}_${request.query.lon}`;

    if (cache[cacheKey]) {
      console.log('returning cached data');
      if ((Date.now() - cache[cacheKey].timestamp) < 3600000) {
        let cacheResponse = [];
        cache[cacheKey].response.data.forEach(element => {
          cacheResponse.push(new Forecast(
            element.datetime, 
            element.weather.description,
            element.low_temp,
            element.high_temp, 
            element.weather.icon));
        });
        response.status(200).send(cacheResponse);
      }
    } else {
        console.log('cached data not found, making api request');
        try {
          let proxyRequest = {
            url: `https://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.lat}&lon=${request.query.lon}&city=${request.query.city}&key=${WEATHERBIT_ACCESS_KEY}&days=7`,
            method: 'GET'
          }
      
          let proxyResponse = [];
          
          axios(proxyRequest)
            .then((axiosResponse) => {

              cache[cacheKey] = {
                timestamp: Date.now(),
                response: axiosResponse.data
              };

              axiosResponse.data.data.forEach(element => {
                proxyResponse.push(new Forecast(
                  element.datetime, 
                  element.weather.description,
                  element.low_temp,
                  element.high_temp, 
                  element.weather.icon));
              });
              response.status(200).send(proxyResponse);
            })
      
        } catch (err) {
          response.status(500).send('Could not complete proxy request to weatherbit');
        }
    }
  }

  module.exports = getWeatherData;
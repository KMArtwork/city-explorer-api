'use strict';

const express = require('express'); //loads express library from node_modules
const cors = require('cors');
const app = express(); // creates a singleton
require('dotenv').config();
const axios = require('axios');

const PORT = process.env.PORT;
const WEATHERBIT_ACCESS_KEY = process.env.WEATHERBIT_ACCESS_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Movie {
  constructor(title, overview, avgVotes, totalVotes, imageUrl, rating, releaseDate) {
    this.title = title;
    this.overview = overview;
    this.avgVotes = avgVotes;
    this.totalVotes = totalVotes;
    this.imageUrl = imageUrl;
    this.rating = rating;
    this.releaseDate = releaseDate;
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

app.get('/movies', async (request, response) => {
  try {
    let proxyRequest = {
      url: `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${request.query.city}&include_adult=false`,
      method: 'GET'
    }

    let proxyResponse = [];
    
    axios(proxyRequest)
      .then((axiosResponse) => {
        axiosResponse.data.results.forEach(movie => {
          proxyResponse.push(new Movie(movie.title, movie.overview, movie.vote_average, movie.vote_count, movie.poster_path, movie.popularity, movie.release_date));
        });
        response.status(200).send(proxyResponse);
      })

  } catch (err) {
    response.status(500).send('Could not complete proxy request to themoviedb');
  }
})

app.listen(PORT, () => {
  console.log('Server is up');
})
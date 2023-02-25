'use strict';

const axios = require('axios');

let cache = require('../data/cache.js');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

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


const getMovieData = async (request, response) => {

  const cacheKey = request.query.city;

  if (cache[cacheKey]) {
    console.log('returning cached data');
    if ((Date.now() - cache[cacheKey].timestamp) < 3600000) {
      let cacheResponse = {
        movies: [],
        timestamp: cache[cacheKey].timestamp,
      };
      cache[cacheKey].response.results.forEach(movie => {
        cacheResponse.movies.push(new Movie(movie.title, movie.overview, movie.vote_average, movie.vote_count, movie.poster_path, movie.popularity, movie.release_date))
      });
      response.status(200).send(cacheResponse);
    }
  } else {
      console.log('cached data not found, making api request');
      try {
        let proxyRequest = {
          url: `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${request.query.city}&include_adult=false`,
          method: 'GET'
        }
        
        let proxyResponse = {
          movies: [],
          timestamp: null,
        };
        // make proxy request to moviedb api
        axios(proxyRequest)
          .then((axiosResponse) => {
            // cache data since it does not exist in cache
            cache[cacheKey] = {
              timestamp: Date.now(),
              response: axiosResponse.data
            };
            // send back array of 'movie' objects to client
            axiosResponse.data.results.forEach(movie => {
              proxyResponse.movies.push(new Movie(movie.title, movie.overview, movie.vote_average, movie.vote_count, movie.poster_path, movie.popularity, movie.release_date));
            });
            proxyResponse.timestamp = Date.now();
            response.status(200).send(proxyResponse);
          })
    
      } catch (err) {
        response.status(500).send('Could not complete proxy request to themoviedb');
      }
  }



  
  }

  module.exports = getMovieData;
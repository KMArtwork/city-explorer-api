'use strict';

const axios = require('axios');

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
  
  }

  module.exports = getMovieData;
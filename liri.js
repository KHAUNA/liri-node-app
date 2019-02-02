require("dotenv").config();
let axios = require("axios");
let moment = require('moment');
var spotifyCodes = require("./keys");
var Spotify = require('node-spotify-api');
var fs = require("fs");

// console.log(spotifyCodes)

//OMDB api call
//https://www.omdbapi.com/?t=avatar&y=&plot=short&apikey=trilogy
//Bandsintown API Call
//https://rest.bandsintown.com/artists/lordhuron/events?app_id=doesntmatter
//===========SPOTIFY============
//https://www.npmjs.com/package/node-spotify-api



//=========CONCERT-THIS================
function bandsInTown(search) {
  let bandsearch = search;
  axios.get(`https://rest.bandsintown.com/artists/${bandsearch}/events?app_id=codingbootcamp`).then(
    function(response) {
      console.log(`==========================================================CONCERT INFORMATION================================================================`)
      for (var i in response.data) {
        var concert = {
            venue: response.data[i].venue.name,
            city: response.data[i].venue.city,
            country: response.data[i].venue.country,
            date: response.data[i].datetime
        }
        console.log(`Concert Date: ${moment(concert.date).format("MM/DD/YYYY")}         Venue Name: ${concert.venue}         Location: ${concert.city}, ${concert.country}`)
      }
    }
  );
};

function movieSearch(search) {
let movieSearch = search;
axios.get(`https://www.omdbapi.com/?t=${movieSearch}&y=&plot=short&apikey=trilogy`).then(
  function(response) {
    if(response.data.Response === "False") {
      axios.get(`https://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy`).then(
        function(response) {
        var movie = {
          title: response.data.Title,
          year: response.data.Year,
          imdbRating: response.data.imdbRating,
          rtRating: response.data.Ratings[1].Value,
          country: response.data.Country,
          lang: response.data.Language,
          plot: response.data.Plot,
          actors: response.data.Actors
        }
        console.log(`===========MOVIE INFORMATION=============`);
        console.log(`Title: ${movie.title}`);
        console.log(`Release Year: ${movie.year}`);
        console.log(`imdb Rating: ${movie.imdbRating}`);
        console.log(`Rotten Tomatoes Rating: ${movie.rtRating}`);
        console.log(`Country: ${movie.country}`);
        console.log(`Language: ${movie.lang}`);
        console.log(`Plot: ${movie.plot}`);
        console.log(`Actors: ${movie.actors}`);
        }
      )
    } else{    
      var movie = {
        title: response.data.Title,
        year: response.data.Year,
        imdbRating: response.data.imdbRating,
        rtRating: response.data.Ratings[1].Value,
        country: response.data.Country,
        lang: response.data.Language,
        plot: response.data.Plot,
        actors: response.data.Actors
      }
      console.log(`===========MOVIE INFORMATION=============`);
      console.log(`Title: ${movie.title}`);
      console.log(`Release Year: ${movie.year}`);
      console.log(`imdb Rating: ${movie.imdbRating}`);
      console.log(`Rotten Tomatoes Rating: ${movie.rtRating}`);
      console.log(`Country: ${movie.country}`);
      console.log(`Language: ${movie.lang}`);
      console.log(`Plot: ${movie.plot}`);
      console.log(`Actors: ${movie.actors}`);
    }
  }
)
};

function songSearch(search) {
  let songSearch = search
var spotify = new Spotify(spotifyCodes.spotify)

  spotify.search({ 
    type: 'track', 
    query: songSearch, 
    limit: 20 },
    function(err, data) {
    if (err) {
      console.log("{ artist: 'Artist(s): Boomboys'"),
      console.log("title: 'Song Title: I Saw the Sign'"),
      console.log("preview: 'Song Preview: https://open.spotify.com/track/7gbe1RssqCTHztIr5mBNck',"),
      console.log("album: 'Album: Best of Euro Dance Music Hits Songs 90\'s. Lo Mejor de la Música Dance Dance Eurodance de los 90' }")

    } else{
        var apiData = data.tracks.items[0];

        var songs = {
          artist: apiData.artists[0].name,
          title: apiData.name,
          preview: apiData.external_urls.spotify,
          album: apiData.album.name
        }
        console.log(songs)
    }
  });
}

function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      // console.log(data);
      var dataArr = data.split(",");
      var randNum = Math.floor( Math.random() * 5 / 2 ) * 2;
      var randInput = randNum + 1
      var randSearchType = dataArr[randNum];
      var randSearchInput = dataArr[randInput];

      if (randSearchType === "concert-this") {
        bandsInTown(randSearchInput);
      } else if (randSearchType === "spotify-this-song") {
        songSearch(randSearchInput)
      } else if (randSearchType === "movie-this") {
        movieSearch(randSearchInput);
      }

    });
  };

var searchType = process.argv[2]
var userInput = process.argv.slice(3).join(" ");

if (searchType === "concert-this") {
  bandsInTown(userInput);
} else if (searchType === "spotify-this-song") {
  songSearch(userInput)
} else if (searchType === "movie-this") {
  movieSearch(userInput);
} else if (searchType === "do-what-it-says") {
  console.log("do it!")
  random();
} else {
  console.log(`Please input a valid command, options are:`);
  console.log(`concert-this`);
  console.log(`spotify-this-song`);
  console.log(`movie-this`);
  console.log(`do-what-it-says`);
}
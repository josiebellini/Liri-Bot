
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

function input(search, chosenInput) {
    var printInput;

    if (chosenInput === undefined) {
        if (search === 'spotify-this-song') {
            chosenInput = '"The Sign" by Ace of Base';
        } 
        else if (search === 'movie-this') {
            chosenInput = 'Mr. Nobody';
        }
    }

    switch (search) {
        case 'my-tweets':
            tweets();
            break;

        case 'spotify-this-song':
            spotify(chosenInput);
            break;

        case 'movie-this':
            imdb(chosenInput);
            break;

        case 'do-what-it-says':
            random();
            break;
    }

    
    if (chosenInput === undefined) {
        printInput = "${search}"
    } 
    else {
        printInput = "${search} ${chosenInput}"
    }

    printInput = "${printInput}" 
    saveData(printInput);
}


//broke and couldnt figure out tweet section
// function tweets() {
//     var client = new Twitter(keys.twitterKeys);
//     var params = {
//         screen_name: 'josephinecarm3n',
//         limit: 2
//     };

  
//     });
// }


function spotify(songTitle) {

    var spotify = new Spotify(keys.spotifyKeys);

    params = {
        type: 'track',
        query: songTitle,
        limit: 1
    }

    spotify.search(params, function(err, data) {
     
        if (err) {
            return console.log('Error occurred: ' + err);
        } 
        else {
            var dataTracksItem = data.tracks.items[0];

            var name = dataTracksItem.album.artists[0].name;
            var song = dataTracksItem.name;
            var url = dataTracksItem.preview_url;
            var album = dataTracksItem.album.name;

            var printSong = `Artist: ${name}\n` +
                            `Song: ${song}\n` +
                            `URL: ${url}\n` +
                            `Album: ${album}\n`
         
            saveData(printSong);
        }
    });
}


function imdb(movieTitle) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body) {

        var dataObj = JSON.parse(body);
        if (!error && response.statusCode === 200) {
            var title = dataObj.Title;
            var year = dataObj.Year;
            var imdbRating = dataObj.imdbRating;
            var country = dataObj.Country;
            var language = dataObj.Language;
            var plot = dataObj.Plot;
            var actors = dataObj.Actors;

            var printMovie = `Movie: ${title}\n` +
                            `Release Year: ${year}\n` +
                            `IMDB Rating: ${imdbRating}\n` +
                            `Country: ${country}\n` +
                            `Language: ${language}\n` +
                            `Plot: ${plot}\n` +
                            `Actors: ${actors}\n` 
                            
            saveData(printMovie);
        }
    });
}


function random() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }

        var data = data.split(',')
        input(data[0], data[1]);
    })
}



function saveData(log) {
    fs.appendFile("log.txt", log, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(log);
        }
    })
}

input(process.argv[2], process.argv[3]);
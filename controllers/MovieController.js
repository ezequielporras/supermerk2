const rates = require('../models/Rate');
const axios = require('axios');
const {OMDB_API_URL, OMDB_API_KEY} = require('../config/constants');
var newRelic = require('newrelic');

let getMovies = async (req, res) => {
    const searchCriteria = req.query.s || 'man';
    let url = `${OMDB_API_URL}/?s=${searchCriteria}&apiKey=${OMDB_API_KEY}`;
    if (req.query.year != null) url += `&y=${req.query.year}`;
    if (req.query.type != null) url += `&type=${req.query.type}`;
    if (req.query.page != null) url += `&page=${req.query.page}`;


    let response = await axios.get(url);
    let {Search} = await response.data;

    res.send(Search);
};

let getMovie = async(req,res)=>
{

    let url = `${OMDB_API_URL}/?i=${req.params.id}&apiKey=${OMDB_API_KEY}&plot=full`;
    let response = await axios.get(url);
    let {Title, Year, Released, Runtime, Genre, Director, Actors, Plot, Poster, imdbID, Type} = await response.data;
    newRelic.addCustomAttribute('movie',Title);

    let rate = rates({
        omdbId: imdbID,
        movieName: Title,
        rating: 0,
        positiveCount : 0,
        negativeCount : 0,
    });

    rates.findOne({omdbId:rate.omdbId})
        .then((movie)=> {
                if (movie === null){
                    rate.save(rate).then(
                        () =>
                        {
                            res.status(200).send({
                                Title,
                                positiveCount:rate.positiveCount,
                                negativeCount:rate.negativeCount,
                                rating:rate.rating,
                                Year,
                                Runtime,
                                Genre,
                                Poster,
                                imdbID,
                                Type,
                                description: Plot,
                                Actors,
                                Director,
                                Released
                            });
                        }
                    )
                } else {

                res.status(200).send({
                    Title,
                    positiveCount:movie.positiveCount,
                    negativeCount:movie.negativeCount,
                    comments:movie.comments,
                    rating:movie.rating,
                    Year,
                    Runtime,
                    Genre,
                    Poster,
                    imdbID,
                    Type,
                    description: Plot,
                    Actors,
                    Director,
                    Released
                });
                }
            }
        ).catch((err) => {
            newRelic.noticeError(err)
            res.status(500).json(err);
    });

};


module.exports = {getMovies, getMovie};
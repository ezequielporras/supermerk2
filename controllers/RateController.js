var rates = require('../models/Rate');
var newRelic = require('newrelic');

let insertRate = (req, res) => {
    var rate = rates({
        omdbId: req.body.omdbId,
        movieName: req.body.movieName,
        positiveCount: req.body.isPositive ? 1 : 0,
        negativeCount: (req.body.isPositive || req.body.isPositive === null)  ? 0 : 1,
        userName: req.body.userName,
        comments: req.body.comment != null ? {
            comment: {
                userId: req.body.userId,
                userName: req.body.userName,
                comment: req.body.comment
            }
        } : null
    });

    rate.save().then
    (
        (rate) => {
            res.status(200).json(rate);
        },
        (err) => {
            console.log(err);
        }
    ).catch((err)=> newRelic.noticeError(err));
}

let getMovieRates = (req, res) => {
    let idPelicula = {omdbId: req.params.omdbId};
    //Listar resultados
    rates.find(idPelicula)
        .then
        (
            (movie) => {
                res.send(movie);
            },
            (err) => {
                console.log(err);
            }
        ).catch((err)=> newRelic.noticeError(err));
};

let updateRate = (req, res) => {
    let rate = rates({
        omdbId: req.body.omdbId,
        movieName: req.body.movieName,
        positiveCount: req.body.isPositive ? 1 : 0,
        negativeCount: (req.body.isPositive || req.body.isPositive === null)  ? 0 : 1,
        comments: req.body.comment != null ? {
            comment: {
                userId: req.body.userId,
                userName: req.body.userName,
                comment: req.body.comment
            }
        } : null
    });

    rates.findOne({omdbId: rate.omdbId})
        .then(
            (movie) => {
                if (rate.positiveCount === 1){
                    newRelic.addCustomAttribute('positiveCount', 'true');
                    newRelic.addCustomAttribute('positiveCountMovie', rate.movieName);
                    movie.positiveCount += rate.positiveCount;
                }

                if (rate.negativeCount === 1){
                    newRelic.addCustomAttribute('negativeCount', 'true');
                    newRelic.addCustomAttribute('negativeCountMovie', rate.movieName);
                    movie.negativeCount += rate.negativeCount;
                }



                if (rate.comments != null) {
                    newRelic.addCustomAttribute('comments', rate.comments[0].comment.userName);
                    newRelic.addCustomAttribute('commentAdded', 'true');
                    movie.comments.push({comment: rate.comments[0].comment});
                }else {
                    newRelic.addCustomAttribute('commentAdded','false');
                }

                movie.save().then
                (
                    (movie) => {
                        res.status(200).json(movie);
                    },
                    (err) => {
                        console.log(err);
                    }
                )
            }
        ).catch((err)=> newRelic.noticeError(err));

};

let getReviews = (req, res) => {
    let commentsArray = [];

    let moviesArray = [];

    let userId = req.params.userId;

    rates.find({"comments.comment.userId": userId})
        .then(
            (movies) => {
                movies.forEach((movie) => {
                        movie.comments.forEach(
                            (comment) => {
                                if (comment.comment.userId === userId) {
                                    commentsArray.push(comment);
                                }
                            }
                        );
                        moviesArray.push({name: movie.movieName, movieId: movie.omdbId, comments: commentsArray});
                        commentsArray = [];
                    }
                );
                res.status(200).json(moviesArray);
            }
        ).catch(
        (err) => {
            newRelic.noticeError(err);
            res.status(500).json(err);
        }
    )
};

module.exports = {
    insertRate: insertRate,
    getRateByMovieId: getMovieRates,
    updateRate: updateRate,
    getReviewsByUserId: getReviews
};
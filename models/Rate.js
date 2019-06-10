var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var rateSchema = new Schema({

    omdbId: String,
    movieName: String,
    rating: Number,
    voteCount: Number,
    positiveCount: Number,
    negativeCount: Number,
    comments: [
        {
        comment:{
            userId: String,
            userName: String,
            comment: String
        }
    }
    ]
});

var Rates = mongoose.model('Rate', rateSchema);
console.log("se creo modelo rate");
module.exports = Rates;
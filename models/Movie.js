var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var movieSchema = new Schema({
    id: String,
    name:String,
    rating:Number,
    plot:String
});

var Movie = mongoose.model('Movie', movieSchema);
console.log("se creo modelo movie");
module.exports = Movie;
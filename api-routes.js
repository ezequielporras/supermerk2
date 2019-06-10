// Initialize express router
let router = require('express').Router();

let movieController = require('./controllers/MovieController');
let rateController = require('./controllers/RateController');


// Set default API response
router.get('/', function (req, res) {
    let body = res.json(
        {
            status: 'API Its Working',
            message: 'This is a health message!',
        });

    res.status(200);
    res.send(body);
});

//EndPoint para leer toda la base
router.get('/movies', movieController.getMovies);
router.get('/movies/:id', movieController.getMovie);

router.get('/rates/:omdbId', rateController.getRateByMovieId);
router.post('/rates', rateController.insertRate);
router.put('/rates', rateController.updateRate);

router.get('/comments/:userId', rateController.getReviewsByUserId);

// Export API routes
module.exports = router;

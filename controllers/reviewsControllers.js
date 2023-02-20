const {selectReviews} = require('../models/reviewsModel')

exports.getReviews = (req, res, next) => {
    return selectReviews()
        .then(reviews => res.status(200).send({reviews}))
        .catch(err => next(err))
}
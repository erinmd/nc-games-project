const { getComments, postComment } = require('../controllers/commentsControllers')
const { getReviews, getReview, patchReview } = require('../controllers/reviewsControllers')

const reviewRouter = require('express').Router()

reviewRouter.get('/', getReviews)
reviewRouter.route('/:review_id')
            .get(getReview)
            .patch(patchReview)
reviewRouter.route('/:review_id/comments')
            .get(getComments)
            .post(postComment)

            
module.exports = reviewRouter
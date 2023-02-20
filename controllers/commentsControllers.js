const { selectComments } = require('../models/commentsModels')

exports.getComments = (req, res, next) => {
  const { review_id } = req.params
  return selectComments(review_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => next(err))
}

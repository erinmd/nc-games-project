const {selectCategories} = require('../models/categoryModels')

exports.getCategories = (req, res, next) => {
    return selectCategories()
        .then(categories => res.status(200).send({categories}))
        .catch(err => next(err))
}
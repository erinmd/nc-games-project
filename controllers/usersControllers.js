const {selectUsers} = require('../models/usersModels')

exports.getUsers = (req, res, next) => {
    return selectUsers()
        .then(users => res.status(200).send({users}))  
        .catch(err => next(err))
}
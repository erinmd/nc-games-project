const {selectUsers, selectUser} = require('../models/usersModels')

exports.getUsers = (req, res, next) => {
    return selectUsers()
        .then(users => res.status(200).send({users}))  
        .catch(err => next(err))
}

exports.getUser = (req, res, next) => {
    const {username} = req.params
    return selectUser(username)
        .then(user => res.status(200).send({user}))
        .catch(err => next(err))
}
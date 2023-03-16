const { checkExists } = require('../models/checkExists')
const {
  selectUsers,
  selectUser,
  selectUserVotes
} = require('../models/usersModels')

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then(users => res.status(200).send({ users }))
    .catch(err => next(err))
}

exports.getUser = (req, res, next) => {
  const { username } = req.params
  return selectUser(username)
    .then(user => res.status(200).send({ user }))
    .catch(err => next(err))
}

exports.getUserVotes = (req, res, next) => {
  const { username } = req.params
  const checkUserExist = checkExists('users', 'username', username)
  const selectUserVotesPromise = selectUserVotes(username)
  return Promise.all([selectUserVotesPromise, checkUserExist])
    .then(([userVotes]) => res.status(200).send({ userVotes }))
    .catch(err => next(err))
}

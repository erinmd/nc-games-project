const { getUsers, getUser, getUserVotes, postUserVote } = require('../controllers/usersControllers')

const userRouter = require('express').Router()

userRouter.get('/', getUsers)
userRouter.get('/:username', getUser)
userRouter.get('/:username/votes', getUserVotes)
userRouter.post('/:username/votes', postUserVote)

module.exports = userRouter
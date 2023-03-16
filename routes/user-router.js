const { getUsers, getUser, getUserVotes } = require('../controllers/usersControllers')

const userRouter = require('express').Router()

userRouter.get('/', getUsers)
userRouter.get('/:username', getUser)
userRouter.get('/:username/votes', getUserVotes)

module.exports = userRouter
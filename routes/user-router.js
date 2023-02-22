const { getUsers, getUser } = require('../controllers/usersControllers')

const userRouter = require('express').Router()

userRouter.get('/', getUsers)
userRouter.get('/:username', getUser)

module.exports = userRouter
const apiRouter = require('express').Router()
const { getEndpoints } = require('../controllers/endpointsController')

apiRouter.get('/', getEndpoints)

module.exports = apiRouter
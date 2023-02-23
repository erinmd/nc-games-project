const { handle500Error, handleCustomError, handlePsqlError, handle404PathError } = require('./controllers/error-handlers')
const { apiRouter, categoryRouter, reviewRouter, commentRouter, userRouter } = require('./routes')
const express = require('express')
const app = express()

app.use(express.json());
app.use('/api', apiRouter)
apiRouter.use('/categories', categoryRouter)
apiRouter.use('/reviews', reviewRouter)
apiRouter.use('/comments', commentRouter)
apiRouter.use('/users', userRouter)

app.use(handle404PathError)
app.use(handleCustomError)
app.use(handlePsqlError)
app.use(handle500Error)

module.exports = app;
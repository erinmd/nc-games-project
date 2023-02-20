exports.handle500Error = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: 'Internal server error'})
}

exports.handleCustomError = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    else next(err)
}

exports.handlePsqlError = (err, req, res, next) => {
    if (err.code === '22P02') {

        res.status(400).send({msg:"Invalid id"})
    }  else if (err.code === '23503') {
        res.status(400).send({msg:err.detail})
    } else next(err)
}
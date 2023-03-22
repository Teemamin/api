const {StatusCodes} = require('http-status-codes')

const errorHandler = (error,req,res,next)=>{
    console.log(error)
    const defaultError = {
        statusCode:  error.statusCode || 500,
        msg: error.message || 'Something went wrong try again later'
    }
    if(error.name === 'ValidationError'){
        defaultError.msg = Object.values(error.errors).map(itm=>itm.message).join(',')
        defaultError.statusCode = StatusCodes.BAD_REQUEST
    }

    if(error.code === 11000){
        defaultError.msg = `${Object.keys(error.keyValue)} field must be unique`
        defaultError.statusCode = StatusCodes.BAD_REQUEST
    }
     res.status(defaultError.statusCode).json({msg:defaultError.msg})
}

module.exports = errorHandler
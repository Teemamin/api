const  jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/unauthorized')

const authenticate = (req,res,next)=>{
    const token = req.cookies.token
    if(!token){
        throw new UnauthenticatedError('Authentication Invalid')
    }
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        // console.log(payload)
        req.user = {userId:payload.userId}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Unauthorized user ')
    }
}

module.exports = authenticate
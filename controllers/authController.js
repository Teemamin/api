const User = require('../model/user')
const BadRequestError = require('../errors/badRequest')
const UnauthenticatedError = require('../errors/unauthorized')
const {StatusCodes} = require('http-status-codes')
const attachCookie = require('../util/attachCookie')



exports.register = async (req,res,next)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password){
        throw new BadRequestError('Please Provide all values')
    }

    const emailExist = await User.findOne({email})
    if(emailExist){
        throw new BadRequestError('Email already exist')
    }
   const user =   await User.create({name, email, password})
   const token = user.createJWT()
   attachCookie({res,token})

   user.password = undefined //to ensure the password is not sent as part of the response
    res.status(StatusCodes.CREATED).json(user)
}

exports.login = async (req,res,next)=>{
    const {email, password} = req.body
    if( !email || !password){
        throw new BadRequestError('Please Provide all values')
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials, Sorry we cannot find the provided email in our database')
    }
    const passwordMatch = await user.comparePassword(password)
    if(!passwordMatch){
        throw new UnauthenticatedError('Invalid Password')
    }
    const token = user.createJWT()
    attachCookie({res,token})

    user.password = undefined
    res.status(StatusCodes.OK).json(user)
}

exports.updateProfile = async (req,res,next)=>{
    const {name,lastName,email} = req.body
    if(!name || !lastName || !email){
        throw new BadRequestError('please provide all values')
    }
    const userData = {name,lastName,email}
    const updatedData = await User.findOneAndUpdate({_id: req.user.userId},userData,{new:true,runValidators: true})
    const token = updatedData.createJWT()
    attachCookie({res,token})
    res.status(StatusCodes.OK).json(updatedData)
}
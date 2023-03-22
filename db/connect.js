const  mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const connectDB = (url)=>{
    return mongoose.connect(url)
}// it returns a promise

module.exports = connectDB
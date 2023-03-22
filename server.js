const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./db/connect')
const expressAsync = require('express-async-errors');
const cookieParser = require('cookie-parser')
const fs = require('fs');
const path = require('path');


const app = express()
dotenv.config()


//routes
const postsRoutes = require('./routes/postRoutes')
const authRoutes = require('./routes/authRoutes')

//middleware
const errorMiddleware = require('./middleware/errorMiddleware')
const pageNotFound = require('./middleware/pageNotFound')




app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
app.get('/',(req,res)=>{
    res.json({msg: 'hello from express'})
})
app.get('/api',(req,res)=>{
    res.json({msg: 'hello from express'})
})
app.use('/api/auth',authRoutes)
app.use('/api/posts', postsRoutes)


 


app.get('/api', (req,res)=>{
    res.send('Welcome')
})

app.use(pageNotFound)
app.use(errorMiddleware)
const port = process.env.PORT || 5000


const start = async ()=>{
    try {
      await connectDB(process.env.MONGO_URL)  
      app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error)
    }
}

start()
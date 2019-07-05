const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const passport = require('passport')
// Bring Routes
const auth =require('./routes/api/auth');
const profile=require('./routes/api/profile');
const questions=require('./routes/api/questions')

// @Middlewar Body-Parser
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//@Config MongoDB
const db=require('./setup/myurl').mongoURL;
console.log(db);
mongoose
    .connect(db,{ useNewUrlParser: true } )
    .then(()=>{
        console.log("Connected DB Successfully!")
    })
    .catch(err=>{
        console.log(err)
    })
    
//@middleware Passport
app.use(passport.initialize())
//@config for JWT Strategy
require('./strategies/jsonwtStrategy')(passport)

const _port=process.env.PORT || 3000

/*      ROUTES      */

/*@route / Home
@desc Homepage
@access PUBLIC */
app.get('/',(req,res)=>{
    res.end("<h1>Hello World</h1>")
})

/*@route  API
@desc API of AUTH, USERS, PROFILE*/
app.use('/api/auth',auth)
app.use('/api/profile',profile)
app.use('/api/questions',questions)

app.listen( _port ,()=>{
    console.log(`Server running at ${_port}`)
})

const express=require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt= require('jsonwebtoken');
const passport=require('passport');
const key = require('../../setup/myurl');
//@import SCHEMA Persons
const Person=require('../../models/Person');

//@type GET
//@route /api/auth
//@desc just for testing
//@access PUBLIC
router.get('/',(req,res)=>{
    res.json({
        test:'Auth is Sucess',
    })
})

//@type POST
//@route /api/auth/register
//@desc Route for registration of User 
//@access PUBLIC
router.post('/register',(req,res)=>{
    Person.findOne({email:req.body.email})
        .then(person =>{
            if(person){
                return res.status(400).json({emailerror:'Email Already Registered !'})
            }
            const newPerson= new Person({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
            });
                //Encrypting password using bycrpt 
                bcrypt.genSalt(10, (err,salt )=> {
                    bcrypt.hash(newPerson.password, salt, (err, hash)=> {
                        if(err) {console.log(err)};
                        newPerson.password = hash;
                        newPerson.save()
                            .then(person=>{
                                res.json(person)
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                    })
})
        })
        .catch(err=>{
            console.log(err);
        })
})

//@route /api/auth/login
//@type POST
//@desc Route for Login for User
//@access PUBLIC
router.post('/login',(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    Person.findOne({email:email})
        .then(person=>{
            if(!person){
                return res.status(404).json({emailerror:'User not Found!'})
            }
            bcrypt.compare(password,person.password)
                .then(isCorrect=>{
                    if(isCorrect){
                        //res.json({success:'User Login Success!'})
                        //use payload create token for user
                        const payload={
                            id:person.id,
                            name:person.name,
                            email:person.email
                        }
                        jsonwt.sign(payload,key.secret,{
                            expiresIn:'1h'
                        },(err,token)=>{
                            if(err) {
                                res.json({
                                    success:false,
                                    err:'Error while creating Token'
                                })
                            }
                            else{
                                res.json({
                                    success:true,
                                    token:"Bearer "+token,
                                })
                            }
                        })
                    }
                    else{
                        res.status(400).json({passworderror:'Incorrect Password'})
                    }
                })
                .catch(err=>console.log(err))
        })
        .catch(err=>{
            console.log(err);
        })
})

//@type GET
//@route /api/auth/profile
//@desc Route for Profile Page
//@access PRIVATE
router.get('/profile',passport.authenticate('jwt',{session:false}),
(req,res)=>{

    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        gender:req.user.gender,        
        profilepic:req.user.profilepic
    })
})


module.exports=router;

const express=require('express');
const router=express.Router();
const passport = require('passport');
const mongoose= require('mongoose');

//Importing Models
const Person=require('../../models/Person');
const Profile=require('../../models/Profile');
const Question= require('../../models/Question');

//@type GET
//@route /api/questions
//@desc Route for Seeing All Questions
//@access PUBLIC
router.get('/',(req,res)=>{
    Question.find()
        .sort({date:'desc'})
        .then(questions=>{
            if(questions){
                questions.unshift({'Questions Found':questions.length})
                return res.json(questions)
            }
            res.json({error:'Fetching Error'})
        })
        .catch(err=>res.json({error:"Database Error"+err}))
})
//@type GET
//@route /api/questions/:q_id
//@desc Route for Seeing A Specific Question
//@access PUBLIC
router.get('/:q_id',(req,res)=>{
    Question.findById(req.params.q_id)
        .then(question=>{
            if(question){
                return res.json(question)
            }
            res.json({error:'Fetching Error'})
        })
        .catch(err=>res.json({error:"Database Error"+err}))
})

//@type POST
//@route /api/questions/add
//@desc Route for Adding a Question
//@access PRIVATE
router.post('/add',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const newQuestion=new Question();
    newQuestion.user=req.user.id;
    newQuestion.textone=req.body.textone;
    newQuestion.texttwo=req.body.texttwo;
    newQuestion.save()
        .then(question=>res.json(question))
        .catch(err=>res.json({error:err}))   
})

//@type POST
//@route /api/questions/:q_id/upvote
//@desc Route for Upvoting
//@access PRIVATE
router.post('/:q_id/upvote',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const newUser={};
    newUser.user=req.user.id;
    Question.findById(req.params.q_id)
        .then(question=>{
            for(upvote of question.upvotes){
                if(upvote.user==req.user.id)
                    return res.json({error:'Cannot Upvote more than once !'})
            }
            question.upvotes.push(newUser);
            question.save()
                .then(question=>res.json(question))
                .catch(err=>res.json({error:"Saving Error"+err}))
        })
        .catch(err=>res.json({error:"Database Error"+err}))
})

//@type POST
//@route /api/questions/:q_id/answer/add
//@desc Route for Adding Answers 
//@access PRIVATE
router.post('/:q_id/answer/add',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const newAnswer={};
    newAnswer.user=req.user.id;
    newAnswer.ansone=req.body.ansone;
    newAnswer.anstwo=req.body.anstwo;
    Question.findById(req.params.q_id)
        .then(question=>{
            question.answers.push(newAnswer);
            question.save()
                .then(question=>res.json(question))
                .catch(err=>res.json({error:"Saving Error"+err}))
        })
        .catch(err=>res.json({error:"Database Error"+err}))
})


module.exports=router;
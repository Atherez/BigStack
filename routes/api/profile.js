const express=require('express');
const router=express.Router();
const mongoose= require('mongoose');
const passport = require('passport');

//Load Person Model
const Person=require('../../models/Person');
//Load Profile Model
const Profile=require('../../models/Profile')

//@type GET
//@route /api/profile
//@desc route for individual user profile
//@access PRIVATE
router.get(
    '/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(!profile){
                    return res.status(404).json({profilenotfound:"No Profile Found"})
                }
                res.json(profile)
            })
            .catch(err=>console.log(err))
    }
)
//@type POST
//@route /api/profile
//@desc route for UPDATING/SAVING individual user profile
//@access PRIVATE
router.post(
    '/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        const profileValues={};
        profileValues.user=req.user.id;
        if(req.body.username) profileValues.username=req.body.username;
        if(req.body.website) profileValues.website=req.body.website;
        if(req.body.country) profileValues.country=req.body.country;
        if(req.body.portfolio) profileValues.portfolio=req.body.portfolio;
        if(typeof req.body.languages !== undefined){
            profileValues.languages=req.body.languages.split(',');
        }
        profileValues.social={};
        if(req.body.youtube) profileValues.social.youtube=req.body.youtube;
        if(req.body.facebook) profileValues.social.facebook=req.body.facebook;
        if(req.body.instagram) profileValues.social.instagram=req.body.instagram;

        //Database Works
        Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(profile){
                    Profile.findOneAndUpdate(
                        {user:req.user.id},
                        {$set :profileValues},
                        {new: true,
                        useFindAndModify:false}
                            ).then(profile=>res.json(profile))
                            .catch(err=>console.log("Error in Update : "+err)); 
                            }
                else{
                    Profile.findOne({username:profileValues.username})
                        .then(profile=>{
                            //already used user
                            if(profile){
                                res.status(400).json({SavingError:"Username Not Available"})
                            }
                            else{
                                new Profile(profileValues).save()
                                    .then(profile=>{
                                        res.json(profile);
                                    })
                                    .catch(err=>console.log("Saving Error")+err);
                            }
                            //saving

                        })
                        .catch(err=>console.log("Database Error : "+err))
                }
            })
            .catch(err=>console.log("Database Error : "+err))
    }
) 

//@type GET
//@route /api/profile/:username
//@desc Route for getting profile of specific username
//@access PUBLIC
router.get('/user/:username',(req,res)=>{
    Profile.findOne({username:req.params.username})
        .populate('user',['name','profilepic'])
        .then(profile=>{
            if(!profile){
                return res.status(404).json({Error:"User not Found"})
            }
            res.json(profile)
        })
        .catch(err=>res.json({FetchingUsernameError:err}))
})

//@type GET
//@route /api/profile/alluser
//@desc Route for getting profile of all users
//@access PUBLIC
router.get('/allusers',(req,res)=>{
    Profile.find()
        .populate('user',['name','profilepic'])
        .then(profiles=>{
            if(!profiles){
                return res.status(404).json({Error:"No Profile Found"})
            }
            res.json(profiles)
        })
        .catch(err=>res.json({FetchingUsernameError:err}))
})

//@type GET
//@route /api/profile/:id
//@desc Route for getting profile with ID
//@access PUBLIC
router.get('/id/:id',(req,res)=>{
    Profile.findById(req.params.id)
        .populate('user',['name','profilepic'])
        .then(profile=>{
            if(!profile){
                return res.status(404).json({Error:"User Not Found"})
            }
            res.json(profile)
        })
        .catch(err=>res.json({FetchingError:err}))
})

//@type DELETE
//@route /api/profile
//@desc Route for deleting user based upon ID
//@access PRIVATE
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOneAndRemove({user:req.user.id})
        .then(()=>{
            Profile.findOneAndRemove({_id:req.user.id})
                .then(()=>{
                    res.json({DeleteSuccess:"Deletion was Success"})
                })
                .catch(err=>res.json({DeletionError:err}))
        })
        .catch(err=>res.json({NotFoundErorr:err}))

})

//@type POST
//@route /api/profile/workrole
//@desc Route for Adding a Work Profile of A Person
//@access PRIVATE
router.post('/workrole',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                return res.json({ProfileNotFound:"Profile was Not Found"})
            }
            const newWork={
                role:req.body.role,
                company:req.body.company,
                country:req.body.country,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                details:req.body.details
            }
            profile.workrole.unshift(newWork);
            profile.save()
                .then(profile=>res.json(profile))
                .catch(err=>{res.json({SavingError:err})})
        })
        .catch(err=>res.json({DatabaseError:err}))
})

//@type DELETE
//@route /api/profile/workrole/:w_id
//@desc Route for Deleting a Workrole
//@access PRIVATE
router.delete('/workrole/:w_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                return res.json({ProfileNotFound:"Profile was not Found"})
            }
            const removeThis=profile.workrole
                .map(item=>item._id)
                .indexOf(req.params.w_id);
            profile.workrole.splice(removeThis,1);
            profile.save()
                .then(profile=>res.json(profile))
                .catch(err=>res.json({SavingError:err}))
        })
        .catch(err=>res.json({DatabaseError:err}))
})


module.exports=router;
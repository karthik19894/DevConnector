const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');

//Load Profile Model
const Profile=require('../../models/Profile');

router.get('/test',(req,res)=>res.json({msg:'Profile works'}));

//Profile Route-Protected
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={};
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(!profile){
            errors.noprofile='No Profile Found'
            return res.status(400).json(errors);
        }
        res.json(profile);
    })
    .catch(err=>res.status(400).json(errors));
});


//Create profile route

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    //Get Fields
    const profileFields={};
    profileFields.user=req.user;

    if(req.body.handle)profileFields.handle=req.body.handle;
    if(req.body.company)profileFields.company=req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    if(typeof req.body.skills!=undefined){
        profileFields.skills=req.body.skills.split(',');
    }

    //Social

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile){
            Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
            .then(profile=>res.json(profile));
        }
        else{
            //Create
        }
    })


})

module.exports=router;
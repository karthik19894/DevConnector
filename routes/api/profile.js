const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');

//Load Profile Model
const Profile=require('../../models/Profile');

router.get('/test',(req,res)=>res.json({msg:'Profile works'}));

//Profile ROute-Protected
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



module.exports=router;
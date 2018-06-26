const express=require('express');
const router=express.Router();
const User=require('../../models/User');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys');
const passport=require('passport');
const validateRegisterInput=require('../../validation/register');
const validateLoginInput=require('../../validation/login');

router.get('/test',(req,res)=>res.json({msg:'Users works'}));


//Register route
router.post('/register',(req,res)=>{
    const {errors,isValid}=validateRegisterInput(req.body);

    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            errors.email='Email already exists';
            return res.status(400).json(erros);
        }else{
            const avatar=gravatar.url(req.body.email,{
                s:'200', //Size
                r:'pg', //Rating
                d:404 //Default
            });
            const newUser=new User({
                name:req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password
            });
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) {
                        throw err;
                    }
                    newUser.password=hash;
                    newUser.save()
                    .then(user=>res.json(user))
                    .catch(err=>console.log(err));
                })
            })
        }
    })

});


//Login Routes

router.post('/login',(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    //check for user
    const {errors,isValid}=validateLoginInput(req.body);
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            errors.email='User not found'
            return res.status(400).json(errors);
        }
        //check password
        bcrypt.compare(password,user.password).then(isMatch=>{
        if(isMatch){
            const payload={
                id:user.id,
                name:user.name,
                avatar:user.avatar
            };
            //Sign token
            jwt.sign(payload,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                res.json({
                    sucess:true,
                    token:'Bearer '+token
                });
            });
        }else{
            errors.password='Password Incorrect'
            return res.status(400).json(errors);
        }
        });
    })
    

    
});

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    });
})

module.exports=router;
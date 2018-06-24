const express=require('express');
const router=express.Router();
const User=require('../../models/User');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');

router.get('/test',(req,res)=>res.json({msg:'Users works'}));

//Register route
router.post('/register',(req,res)=>{
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            return res.status(400).json({email:'Email already exists'});
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
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.status(400).json({email:'User not found'});
        }
        //check password
        bcrypt.compare(password,user.password).then(isMatch=>{
        if(isMatch){
            res.json({msg:'Success'})
        }else{
            return res.status(400).json({password:'Password Incorrect'});
        }
        });
    })
    

    
});

module.exports=router;
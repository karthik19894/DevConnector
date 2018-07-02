const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');
const Post=require('../../models/Post');
const Profile=require('../../models/Profile');

router.get('/test',(req,res)=>res.json({msg:'Posts works'}));

//Get validation
const validatePostInput=require('../../validation/post');

//ROute for Getting all posts

router.get('/',(req,res)=>{
    Post.find()
    .sort({date:-1})
    .then(posts=>res.json(posts))
    .catch(err=>res.status(400).json({nopostsfound:'No posts found'}))
});


//Route for getting single post

router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
    .then(post=>res.json(post))
    .catch(err=>res.status(400).json({nopostfound:'No post found for this ID'}))
})

//Route for Create Posts

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors,isValid}=validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    const newPost=new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    });

    newPost.save().then(post=>res.json(post));
});


//Route for Deleting a Post

router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            //CHeck for post user
            if(post.user.toString()!==req.user.id){
                return res.status(401).json({notauthorized:'User not authorized'});
            }
            //Delete
            post.remove().then(()=>res.json({success:true}))
            .catch(err=>res.status(404).json({postnotfound:'No post found'}));
        })
    })

})


//Route for Likes
router.post('/like/:id,',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            //CHeck for post user
            if(post.likes.filter(like=>like.user.toString()===req.user.id.length>0)){
                return res.status(400).json({alreadyliked:'User already liked the post'});
            }
            //Add user id to the likes
            post.likes.unshift({user:req.user.id});
            post.save().then(post=>res.json(post));
        })
    })

});

//Route for UnLike
router.post('/unlike/:id,',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            //CHeck for post user
            if(post.likes.filter(like=>like.user.toString()===req.user.id.length===0)){
                return res.status(400).json({notliked:'You have not yet liked this post'});
            }
            //Get remove index
            const removeIndex=posts.likes.map(item=>item.user.toString().indexOf(req.user.id));

            //Remove user id to the likes
            post.likes.splice(removeIndex,1);
            post.save().then(post=>res.json(post));
        })
    })

});

//Route for adding comments
router.post('/comment/:id,',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors,isValid}=validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post=>{
            const newComment={
                    text:req.body.text,
                    name:req.body.name,
                    avatar:req.body.avatar,
                    user:req.user.id
            }
            //Add to comments array
            post.comments.unshift(newComment);
            post.save().then(post=>res.json(post));
        })


});


//Route for deleting a comment

router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
    .then(post=>{
        if(post.comments.filter(comment=>comment._id.toString()===req.params.comment_id).length===0){
            return res.status(404).json({commentnotfound:'Comment Not Found for this Id'});
        }
        //Get Remove Index
        const removeIndex=post.comments.map(item=>item.id.toString().indexOf(req.params.comment_id));

        //Splice the comment out of the comments array
        post.comments.splice(removeIndex,1);
        post.save().then(post=>res.json(post))
        .catch(err=>res.json(err));
    })
})


module.exports=router;
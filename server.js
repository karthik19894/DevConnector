const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const passport=require('passport');

const port=process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');

//DB Config
const db=require('./config/keys').mongoURI;

//Connect to DB
mongoose.connect(db)
.then(()=>console.log('Connected to Database'))
.catch(err=>console.log(err));

//Passport Middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);


//Routes Middleware


app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);




app.get('/',(req,res)=>{
    res.send('Welcome to DevConnector Backend API');
});

app.listen(port,(req,res)=>{
    console.log(`Server running on port ${port}`);
})
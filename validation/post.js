const Validator=require('validator');
const isEmpty= require('./is-empty');

module.exports=function validatePostInput(data){
    let errors={};

    data.text=isEmpty(data.text)?data.text:'';

    if(!Validator.isLength(data.text,{min:10,max:300})){
        errors.text='Post must be between 10 and 300 characters';
    }

    if(!Validator.isEmail(data.text)){
        errors.text='Text Field is Required!';
    }

    if(Validator.isEmpty(data.email)){
        errors.email='Email field is required!';
    }

    if(Validator.isEmpty(data.password)){
        errors.password='Password field is required!';
    }
    

    return{
        errors,
        isValid:isEmpty(errors)
    }
}
const express = require('express');
const cors =require('cors');
const mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');
const app=express();
require ('dotenv').config()
const bcrypt = require('bcryptjs');
const bcryptSalt =  bcrypt.genSaltSync(10);
const User = require('./models/User.js');
const e = require('express');
const jwtSecret = 'fsdf34bgnfnt5ybfnnh';
const cookieParser = require('cookie-parser')



app.use(express.json());
app.use(cookieParser());

app.use(cors({
   
    origin:'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials:true,
}));



mongoose.connect(process.env.MONGO_URL)

.then(()=>{
    console.log("mongodb is connected");
})
.catch(()=>{
    console.log('Failed');
})

app.get('/test',(req,res)=>{
    res.json('test ok');
});



app.post('/register',async(req,res)=>{
    const {name,email,password} = req.body;

   

    try {

        const user = await User.create ( {
            name:name,
            email:email,
            password:bcrypt.hashSync(password,bcryptSalt) 
        });
        res.json(userDoc);


    } catch (e) {
        
        res.status(422).json(e);
    }
    
   

    
});

app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    const userDoc = await User.findOne({email:email})

       
        
       if(userDoc){
          
         const passOk = bcrypt.compareSync(password,userDoc.password)
           
         if(passOk){

            jwt.sign({email:userDoc.email , id:userDoc._id,name :userDoc.name},jwtSecret,{},(err,token) =>{
                 
                if(err)throw err;
                res.cookie('token','token').json(userDoc);
            });
            
        }
        else{
            res.status(422).json('pass not ok');
        }


       }

       else{

          res.json('notexist');
       }

    
        
        res.json("notexist")
    
    
});

app.get('/profile',(req,res)=>{

    const{token} = req.cookies;

    if(token){

        jwt.verify(token, jwtSecret,{}, (err,user) =>{

            if(err) throw err;
            res.json(user);

        });
    }
    else{
          
        res.json(null);
    }
    
})

app.listen(4000,()=>{
    console.log("port connected");
});
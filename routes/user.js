const express = require('express')
const router = express.Router();
var models  = require('../models');
const  bcrypt  =  require('bcryptjs');
const SECRET_KEY = "secretkey23456";
const  jwt  =  require('jsonwebtoken');
const { Op } = require("sequelize");


const  findUserByEmail  = (email, cb) => {
    
    return models.user.findOne({
        where: {
            email: email,
        },
        order: [ [ 'createdAt', 'DESC' ]],
    }).then(function(result) {
        if (result!=null&&!result['id']) 
              cb(1,result);
        else
            cb(0,result);
    });
}

const  createUser  = (user, cb) => {
    return models.user.create({
        name:user[0],
        email:user[1],
        password:user[2],
        phone:user[3]
    }).then(function(result) {
          if (!result['id']) 
              cb(1);
        else
            cb(0);
    });
}

router.get('/view', (req, res, next) => {
        var token =req.header('authorization');
        if(token!='')
            token=token.split(" ")[1];
        jwt.verify(token,SECRET_KEY,function(err,token){
        if(err){
            return  res.status(500).send('Invalid Token');  
        }else{
            console.log(token['id'])
            let responsearr={};
            responsearr['status']=0;
            responsearr['message']='No result found';
            responsearr['data']={};
            models.userfriends.findAll({
                where: {
                    [Op.or]:[
                      {
                        userid:token['id']
                      },
                      {
                        friendid:token['id']
                      }
                    ],
                },
                include: [{
                        model: models.user,
                        required: true,
                        as:'sfriendid',
                        attributes: {
                            exclude: ['password']
                        }
                    },
                    {
                        model: models.user,
                        required: true,
                        as:'muserid',
                        attributes: {
                            exclude: ['password']
                        }
                    },
                    {
                        model: models.thread,
                        required: false,
                        limit: 1,
                        order: [ [ 'createdAt', 'DESC' ]]
                    },
                ]
            }).then(function(user){
                if(user==null||user.length == 0)
                    return res.status(200).json(responsearr);
                responsearr['status']=1;
                responsearr['message']='';
                // for(let i=0;i<user.length;i++)
                // {
                //     models.thread.findOne({
                //         limit:1,
                //         where: {
                //             'id':user[i]['dataValues']['id']
                //         },
                //         order: [ [ 'createdAt', 'DESC' ]]
                //     }).then(function(thread){
                //         user[i]['lastMessage']=thread;
                //     });
                // }
                responsearr['data']=user;
                return res.status(200).json(responsearr);
            })
        }});
})

router.post('/register', (req, res) => {

    const  name  =  req.body.name;
    const  email  =  req.body.email;
    // console.log(req.body);
    const  password  =  bcrypt.hashSync(req.body.password);
    const  phonenumber  =req.body.phonenumber;

    createUser([name, email, password,phonenumber], (err)=>{
        if(err) return  res.status(500).send("Server error!");
        findUserByEmail(email, (err, user)=>{
            // console.log(err)
            console.log(user.id)

            if (err) return  res.status(500).send('Server error!');  
            const  expiresIn  =  24  *  60  *  60;
            const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
                expiresIn:  expiresIn
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn          
            });
        });
    });
});


router.post('/login', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    findUserByEmail(email, (err, user)=>{
        if (err) return  res.status(500).send('Server error!');
        if (!user) return  res.status(404).send('User not found!');
        const  result  =  bcrypt.compareSync(password, user.password);
        if(!result) return  res.status(401).send('Password not valid!');

        const  expiresIn  =  24  *  60  *  60;
        const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
            expiresIn:  expiresIn
        });
        res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
    });
});

module.exports = router;
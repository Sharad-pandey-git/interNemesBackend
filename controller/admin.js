const Admin = require("../models/admin");
const {check, validationResult} = require("express-validator")
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signin = (req, res)=>{
    const errors = validationResult(req);
    const {user_name, password} = req.body;

    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    Admin.findOne({user_name} , (err , admin)=>{
        if (err || !admin){
            return res.status(400).json({
                error : "User Name doesn't exist !" 
            })
        }

        if( !admin.authenticate(password) ){
            return res.status(401).json({
                error:"UserName and Password doesn't matches"
            })
        };

        //Creat token
        const token = jwt.sign({_id : admin._id}, process.env.SECRET)
        //Put Token into cookie expiring in 5 minutes
        res.cookie("token",token, { maxAge: 5* 60 * 1000, httpOnly: true });

        const {_id , user_name } = admin ;

        const final_res = {
            message: "Successfully LOgin As Admin",
            user:{
                _id ,
                user_name,
                role:1,
                // token
            }
        }

        return res.status(200).json(final_res)


    })   

}

exports.signup = (req, res)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    const admin = new Admin(req.body);
    admin.save( (err , admin)=>{
        if (err){
            return res.status(400).json({
                err : "Custom- NOT able to save Data in DB"
            })
        };
        res.json( {
            name : admin.user_name,
            email : admin.email,
            pass : admin.encry_password
        } ) ;
        
    } )
}

exports.updateAdmin = (req, res)=>{
    Admin.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new:true , useFindAndModify:false},
        (err , _user)=>{
            if(err){
                return res.status(400).json({
                    error : "You are not authoorised to update stuff !"
                })
            };
            
            _user.salt = undefined
            _user.encry_password = undefined
            res.json(_user);
        }
    )
}

// We dont need to write next() inside this cos express-jwt handels it 
exports.is_signined = expressJwt({
    secret: process.env.SECRET ,
    userProperty: "auth"
})

// Custom middlewares

exports.isAuthenticated = (req, res , next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id ;
    if(!checker){
        return res.status(403).json({err : "Access senied , Unauthorised !"})
    };
    next()
}

exports.isAdmin = (req,res , next)=>{
    if(req.profile.role == 0){
        return res.status(403).json({
            err : "You r not Admin , Permission denied for admin request !"
        })
    };
    next()
}

var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');
const { signin, signup, updateAdmin } = require('../controller/admin');


router.post('/signin' , [
    check("user_name", "PLZ enter user_name").isLength({min:1}),
    check("password", "PLZ enter a password").isLength({min:1})] ,signin 
)

router.post('/signup' ,[
    check("user_name","Plz enter a username of length more than 2").isLength({min:3}),
    check("email", "Plz enter a valid email").isEmail(),
    check("password", "Password must be atleast 5 characters").isLength({min:5})
] ,signup)

router.put('/update', updateAdmin)


module.exports = router;

const User_ = require("../models/user");

exports.getUserById = (req, res, next, id) => {
    User_.findById(id).exec((error, user) => {
        if (error) {
            return res.status(400).json({
                error: "Custom err- Error in finding User By id "
            })
        }
        req._user = user;
        next();
    })
}

exports.getUser = (req, res) => {
    return res.json(req._user)
}

exports.getAllUsers = (req, res) => {
    User_.find().exec((error, users) => {
        if (error) {
            return res.status(400).json({
                error: "Custom err- Error in getting all the users"
            })
        }
        res.json(users);
    });
}

exports.createUser = (req , res)=>{
    const _user = new User_(req.body)
    console.log("User Entery : ",req.body)
    _user.save( (err, createdUser)=>{
        if(err){
            return res.status(400).json( {error : "Custom err : Unable to create User"} )
        }
        res.json(createdUser)
    } )

}

exports.deleteUser = (req, res)=>{
    const _user = req._user;
    _user.remove( (err , deletedUser)=>{
        if(err){
            return res.status(400).json( {error : "Unable to delete Stream from DB"} );
        }
        res.json({message : `Successfully deleted ${ deletedUser.name}`});
    } )
}


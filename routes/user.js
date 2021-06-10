var express = require('express');
var router = express.Router();

const {
    getAllUsers, getUserById, createUser, deleteUser,getUser
} = require("../controller/user");

// Params
router.param("userId" , getUserById)

// ############## Routes ##############

// Creat
router.post("/create/user" ,createUser);

// Read
router.get("/user/:userId" , getUser);
router.get("/allUsers" , getAllUsers);

// Delete
router.delete("/delete/user/:userId" ,deleteUser)


module.exports = router ;
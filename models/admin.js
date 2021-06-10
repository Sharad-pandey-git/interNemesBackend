const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");

const admin_Schema = new mongoose.Schema({
  user_name: {
    type: String,
    require: true,
    unique: true
  },
  encry_password: {
    type: String,
    require: true
  },
  salt: String,
  email: {
    type: String,
    unique: true
  }
}, { timestamps: true });

admin_Schema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

admin_Schema.methods = {
  authenticate: function(plainpassword){
    return this.securePassword(plainpassword) === this.encry_password;
  }
  ,securePassword: function(plainpassword){
    if (!plainpassword) return "" ;

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  }

};



module.exports = mongoose.model("Admin", admin_Schema);
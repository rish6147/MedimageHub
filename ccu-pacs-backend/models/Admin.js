var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");
// var findOrCreate          = require("mongoose-findorcreate");
// const comment = require("./comment");

var adminSchema = new mongoose.Schema({
    // name: { type: String, required: true },
    name: String,
    emailId: String,
    username: String,
    password: String,
    // author: {
    //     id:{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref : "User"
    //     },
    //     username: String
    // }
})

module.exports = mongoose.model("Admin",adminSchema);

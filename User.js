const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({ 
  username: String, 
  email: String, 
  password: String 
}, { collection: "users" }); // Forces collection name to "users"

module.exports = mongoose.model("User", UserSchema);



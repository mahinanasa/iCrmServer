const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({

  name: {
    type: String,
    require: [true, "Please add a name"]
  },

  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },

  role: {
    type: String,
    enum: ['superAdmin', 'staff'],
    default: 'staff'    
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 6,
    select: false
  },

  createdBy: {
    type: String
  },

  
  updatedBy: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now 
  },

  updatedAt: {
    type: Date,
    default: Date.now 
  },
  
  __v: { type: Number, select: false}

},
{
    timestamps: true
})


//Hashing the password before saving to db.
userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  };
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// userSchema.pre('updateOne', async function(next){
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

//Signing the JWT token with the _id of user.
userSchema.methods.getSignedJwtToken = function(){
 return jwt.sign({id: this._id,role:this.role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
};

//Comparing the entered password with hashed password
userSchema.methods.verifyPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
 };


module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const leadSchema = mongoose.Schema({

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

  phone: {
    type: Number,
    required: [true, "Please enter a phone"],
    minlength: 10,
  },

  createdBy: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
  __v: { type: Number, select: false }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Lead', leadSchema);
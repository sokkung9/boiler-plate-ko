const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt의 length
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }

});

// User model에 정보를 저장하기 전에 function이 실행
userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
  
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err)
        return next(err)

      bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
        if (err)
          return next(err)
        user.password = hash
        next()
      });
    });
  } else {
    next()
  }

})

userSchema.methods.comparePassword = function(plainPassword, callbackFunc) {
  // plainPassword = '1234567'
  // hash를 compare
  bcrypt.compare(plainPassword, this.password, function(err, isMatched) {
    if (err)
      return callbackFunc(err)
    callbackFunc(null, isMatched)
  })
}

userSchema.methods.createToken = function(callbackFunc) {
  var user = this;
  // jsonwebtoken으로 create token
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token;
  user.save(function(err, user) {
    if (err)
      return callbackFunc(err)
    callbackFunc(null, user)
  })
}

userSchema.statics.findByToken = function(token, callbackFunc) {
  var user = this;

  // decode token
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // user id로 user를 찾는다
    // client에서 가져온 token과 db에 있는 token이 일치하는지 확인
    user.findOne({ "_id": decoded, "token": token }, function(err, user) {
      if (err)
        return callbackFunc(err);
      callbackFunc(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
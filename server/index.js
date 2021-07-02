const express = require('express') // express module을 가져와서
const app = express()
const port = 5000
// body-parser deprecated
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// application/json
app.use(express.json());
app.use(cookieParser());

const config = require('./config/key')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongxoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! changed!')) // root director에서 hello world를 출력

app.post('/api/users/register', (req, res) => {
  // client에서 보내준 정보를 가져와서
  const user = new User(req.body)

  // db에 post
  // User Model에 정보가 저장됨
  user.save((err, userInfo) => {
    if (err)
      return res.json({ success: false, err })

    return res.status(200).json({
      success: true
    })
  })

  
})

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일이 db에 있는지 확인
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: '입력한 이메일에 해당하는 유저가 없습니다.'
      })
    }
  
  // 있다면 비밀번호 확인
  userInfo.comparePassword(req.body.password, (err, isMatched) => {
    if (!isMatched)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다."
      })
    // 비밀번호가 일치하면 create token
      userInfo.createToken((err, user) => {
        if (err)
          return res.status(400).send(err);
        
        // save token in cookie or localStorage.
        res.cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id
          })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  // auth를 통과 => authentication === true
  // client에 json 형식으로 data 전달
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  // logout할 유저를 찾아서 인증 정보를 삭제
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" },
    (err, user) => {
      if (err)
        return res.json({ success: false, err })
      return res.status(200).send({
        success: true
      })
    })
})

app.get('/api/hello', (req, res) => {
  res.send("hello")
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // port = 5000 에서 실행
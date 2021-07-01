const express = require('express') // express module을 가져와서
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User')

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

const config = require('./config/key')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! changed!')) // root director에서 hello world를 출력

app.post('/register', (req, res) => {
  // client에서 보내준 정보를 가져와서
  const user = new User(req.body)

  // db에 post
  // User Model에 정보가 저장됨
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })

  
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // port = 5000 에서 실행
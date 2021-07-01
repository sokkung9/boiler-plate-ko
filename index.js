const express = require('express') // express module을 가져와서
const app = express()
const port = 5000

const password = 'sy1506'

const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://soyeong:${password}@boilerplate.dcr8p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 222')) // root director에서 hello world를 출력

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // port = 5000 에서 실행
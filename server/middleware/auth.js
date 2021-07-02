const { User } = require("../models/User");

let auth = (req, res, next ) => {

  // authentication
  // client에서 cookie의 token 가져오기
  let token = req.cookies.x_auth;
  
  // token을 복호화한 후 user_id를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({ isAuth: false, error: true }); // client에 response 보냄
    req.token = token;
    req.user = user;
    next();
  })
  // user가 있으면 okay
  // 없으면 no

}

module.exports = { auth };
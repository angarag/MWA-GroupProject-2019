var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const User = require('./../model/user.model')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/test', (req, res) => {
  const result = {
    name: req.body.name,
    address: req.body.address,
    date: Date.now
  }
  const test = new Test(result);
  test.save()
    .then(result => {
      return res.json({data:result})
    })
    .catch(error => {
      return res.json({error: error})
    })
})

router.post("/signup", function(req, res, next) {
  bcrypt.hash(req.body.password, 10).then(password => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: password,
      role: "staff",
      isActive: true
    });

    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});



router.get("/users", function(req, res, next) {
  User.find({})
    .then(result => {
      return res.status(200).json({
        data: result
      });
    })
    .catch(error => {
      return res.status(500).json({
        error: error
      });
    });
});

router.post("/users", function(req, res, next) {
  isActive = !req.body.isActive;
  console.log(isActive);
  User.findOneAndUpdate(
    {_id: req.body._id},
    {$set: {'isActive': isActive}},
    (err, result) => {
      console.log(result.firstName);
      return res.status(200).json({
        data: result
    })
  });      
});

router.get("/getRoleByToken", function(req, res, next) {
  console.log(req.query.token)
  console.log('token is above')
  if(req.query.token==null){
    return res.status(401).json({
    error:'no token passed'
    })  
  }
  else{
    var legit = jwt.verify(req.query.token, process.env.JWT_SECRET, { expiresIn: "2h" });
    console.log('decoded token:'+legit.role)
    return res.status(200).json({
      data:legit.role
    })
  
  }

})
// user login
router.post("/login", function(req, res, next) {
  let fetchedUser;
  console.log(req.body.email);

  User.findOne({ 'email': req.body.email })
    .then(user => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "Authorization failed"
        });
      }
      fetchedUser = user;
//      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      console.log(result);
      if (!result) {
       // res.status(401).json({
        //  message: "Worng password"
        //});
        console.log('wrong password');
      }
      console.log("I am here");
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          role: fetchedUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      return res.status(200).json({
        _token: token,
        _expiresIn: 7200,
        _role: fetchedUser.role,
        _firstName: fetchedUser.firstName,
        _lastName: fetchedUser.lastName,
        message: "Login Successfull."
      });
    })
    .catch(error => {
      return res.status(401).json({
        message: "Auth Failed",
        error: error
      });
    });
});


module.exports = router;

var config = require('./db-config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const saltRounds = 10;

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */
function testGetCategories(req, res) {
  var query = `
  SELECT *
  FROM Categories 
  LIMIT 10
  `
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}


/* ---- (Best Genres) ---- */
function getDecades(req, res) {
  var query = `
  SELECT DISTINCT City
  FROM Businesses
  ORDER BY City
`;
connection.query(query, function (err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});
}

async function addNewUser(req, res) {
  console.log('hello addNewUser');
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)
  var user = {
    "email": req.body.email,
    "password": encryptedPassword,
    "username": req.body.username
  }
  console.log(user);

  var query = `SELECT * FROM USERS WHERE email = '${user.email}' OR username = '${user.username}';`
  connection.query(query, async function (error, results, fields) {
    if (error) {
      console.log("error in register ");
      res.send({
        "code": 400,
        "failed": "error ocurred"
      })
    } else {
      if (results.length > 0) {
        res.send({
          "status": 206,
          "success": "Email or username already exists"
        });
      }
      else {
        var query = `INSERT INTO USERS(email, password, username) 
        VALUES ('${user.email}', '${encryptedPassword}', '${user.username}');`
        connection.query(query, function (error, rows, fields) {
          if (error) {
            res.send({
              "status": 400,
              "failed": "error ocurred"
            })
          } else {
            res.send({
              "status": 200,
              "success": "user registered sucessfully"
            });
          }
        });
      }
    }
  });
}

function logout(req, res) {
  req.session = null;
  res.redirect('/');
};


async function validateLogin(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var query = `SELECT * FROM USERS WHERE email = '${email}';`
  connection.query(query, async function (error, results, fields) {
    if (error) {
      console.log("error in validate Login ");
      res.send({
        "code": 400,
        "failed": "error ocurred"
      })
    } else {
      if (results.length > 0) {
        const comparision = await bcrypt.compare(req.body.password, results[0].password)
        if (comparision) {
          res.send({
            "status": 200,
            "success": "login sucessfull"
          })
        }
        else {
          res.send({
            "status": 204,
            "success": "Email and password does not match"
          })
        }
      }
      else {
        res.send({
          "status": 206,
          "success": "Email does not exits"
        });
      }
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  testGetCategories: testGetCategories,
  addNewUser: addNewUser,
  validateLogin: validateLogin,
  logout: logout,
  getDecades: getDecades
}
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

function getCategoriesByCity(req, res) {
  var inputCity = req.params.city;
  console.log(inputCity);
  var query = `
  SELECT Category, COUNT(*) as Count
  FROM Categories JOIN ReviewNoText1 ON Categories.BusinessID = ReviewNoText1.BusinessID
  JOIN Businesses ON Businesses.ID = Categories.BusinessID
  WHERE City = '${inputCity}'
  GROUP BY Category
  ORDER BY COUNT(*) DESC
  LIMIT 10;`
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

function bestCategoriesPerCity(req, res) {
  var city = req.params.selectedCity;
  var query = `
  SELECT Category as genre, AVG(Stars) as avg_rating
	FROM Categories JOIN Businesses ON Businesses.ID = Categories.BusinessID
	WHERE Businesses.City = '${city}'
  GROUP BY genre
  ORDER BY avg_rating DESC
  LIMIT  10;

`;

connection.query(query, function (err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});
}

function preCovidRating(req, res) {
  var city = req.params.selectedCity;
  var query = `
  SELECT AVG(Stars) as output
	FROM Categories JOIN Businesses ON Businesses.ID = Categories.BusinessID
	WHERE Businesses.City = '${city}'
  LIMIT  1;

`;

connection.query(query, function (err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});
}

function midCovidRating(req, res) {
  var city = req.params.selectedCity;
  var query = `
  SELECT AVG(Stars) as output
	FROM Categories JOIN Businesses ON Businesses.ID = Categories.BusinessID
	WHERE Businesses.City = '${city}'
  LIMIT  1;

`;

connection.query(query, function (err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});
}


function percentOpen(req, res) {
  var city = req.params.selectedCity;
  var query = `
  WITH a as (
    SELECT COUNT(*) as total
    FROM CovidData JOIN Businesses ON Businesses.ID = CovidData. BusinessID
    WHERE Businesses.City = '${city}'
    )
    SELECT COUNT(*) / AVG(a.total) as output
    FROM CovidData JOIN Businesses ON Businesses.ID = CovidData. BusinessID JOIN a 
    WHERE Businesses.City = '${city}' AND ClosedUntil = 0;
`;

connection.query(query, function (err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});
}

function ToD(req, res) {
  var city = req.params.selectedCity;
  var query = `
  SELECT COUNT(*) as output
  FROM CovidData JOIN Businesses ON Businesses.ID = CovidData.BusinessID
  WHERE CovidData.DelOrTo = 'TRUE' AND Businesses.City = '${city}';
`;

connection.query(query, function (err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});
}

function GrubHub(req, res) {
  var city = req.params.selectedCity;
  var query = `
  SELECT COUNT(*) as output
  FROM CovidData JOIN Businesses ON Businesses.ID = CovidData.BusinessID
  WHERE Grubhub = 'TRUE' AND Businesses.City = '${city}'
  ;
`;

connection.query(query, function (err, rows, fields) {
  if (err) console.log(err);
  else {
    res.json(rows);
  }
});
}

function getCities(req, res) {
  var query = `
  WITH b AS (SELECT City, count(*) as num
  FROM Businesses
  GROUP BY City)
  
  SELECT DISTINCT City
  FROM b
  WHERE num > 100
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
  getCategoriesByCity: getCategoriesByCity,
  getCities: getCities,
  bestCategoriesPerCity: bestCategoriesPerCity,
  preCovidRating: preCovidRating,
  midCovidRating: midCovidRating,
  percentOpen: percentOpen,
  ToD: ToD,
  GrubHub: GrubHub
}
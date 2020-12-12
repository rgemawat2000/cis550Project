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
  FROM Categories 
  JOIN ReviewNoText ON Categories.BusinessID = ReviewNoText.BusinessID
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
  FROM Categories 
  JOIN Businesses ON Businesses.ID = Categories.BusinessID
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
  SELECT AVG(ReviewsNoText.Stars) as output
  FROM Businesses 
  JOIN ReviewsNoText ON Businesses.ID = ReviewsNoText.BusinessID
  WHERE Businesses.City = '${city}';
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
  SELECT AVG(ReviewsNoText.Stars) as output
  FROM Businesses 
  JOIN ReviewsNoText ON Businesses.ID = ReviewsNoText.BusinessID
  WHERE ReviewsNoText.Date >= STR_TO_DATE('20190101 0101','%Y%m%d %h%i') AND Businesses.City = '${city}';
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
  WITH a AS (
    SELECT COUNT(*) as total
    FROM CovidData 
    JOIN Businesses ON Businesses.ID = CovidData. BusinessID
    WHERE Businesses.City = '${city}'
    )
    SELECT COUNT(*) / AVG(a.total) as output
    FROM CovidData 
    JOIN Businesses ON Businesses.ID = CovidData. BusinessID JOIN a 
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
  FROM CovidData 
  JOIN Businesses ON Businesses.ID = CovidData.BusinessID
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
  FROM CovidData 
  getRecsJOIN Businesses ON Businesses.ID = CovidData.BusinessID
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
  WHERE num > 500
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
    "email": req.body.email.toLowerCase(),
    "password": encryptedPassword,
    "username": req.body.username
  }
  console.log(user);

  var query = `
  SELECT * 
  FROM USERS 
  WHERE email = '${user.email.toLowerCase()}' OR username = '${user.username}';`
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
        VALUES ('${user.email.toLowerCase()}', '${encryptedPassword}', '${user.username}');`
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

async function validateLogin(req, res) {
  var email = req.body.email;
  email = email.toLowerCase();
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
          req.session.email = email;
          res.send({
            "status": 200,
            "success": "login successful"
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

function getRecs(req, res) {
  console.log(req);
  var inputPC = req.params.postalCode;
  var inputCategory = req.params.category;
  var inputRating = req.params.minRating;
  var inputDelivery = req.params.delivery;
  var inputService = req.params.service;
  var user = req.params.useremail.toLowerCase();
  var delivery = "FALSE"
  var service = "FALSE"
  if (inputDelivery == "Yes") {
    delivery = "TRUE"
  }
  if (inputService == "Yes") {
    service = "TRUE"
  }

  var query = `
  WITH Avg_Rating AS (
  SELECT Businesses.PostalCode, AVG(Stars) as Avg_Area_Rating
  FROM Businesses
  GROUP BY Businesses.PostalCode),
  userBookMarks AS (
  SELECT Bookmarks.BusinessID
  FROM Bookmarks
  WHERE Bookmarks.UserEmail = '${user}'
  )
  SELECT DISTINCT Name AS name, Address AS address, Businesses.Stars AS rating, 
  Businesses.ID, userBookMarks.BusinessID as hasBookmark,
  CASE
    WHEN Businesses.Stars >= Avg_Area_Rating THEN "Yes"
	  ELSE "No"
  END AS abv_avg, IsOpen AS open
  FROM Businesses 
  LEFT JOIN userBookMarks ON Businesses.ID = userBookMarks.BusinessID
  JOIN Categories ON Businesses.ID = Categories.BusinessID
  JOIN Avg_Rating ON Businesses.PostalCode = Avg_Rating.PostalCode
  JOIN CovidData ON Businesses.ID = CovidData.BusinessID
  WHERE Businesses.PostalCode = ${inputPC} 
  AND Category = '${inputCategory}' AND Businesses.Stars >= ${inputRating}
  AND CovidData.DelOrTo = '${delivery}' AND CovidData.VirtualServices = '${service}'
  ORDER BY Businesses.Stars DESC, Name 
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
};

function getCategories(req, res) {
  var query = `SELECT DISTINCT Category AS category
  FROM Categories
  ORDER BY Category
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
};

function bookmarks(req, res) {
  var user = req.params.sessionEmail.toLowerCase();
  var query = `SELECT Businesses.Name as name, Businesses.Address as address,
  Businesses.City as city, Businesses.State as state, Businesses.Stars as stars,
  Businesses.ID as ID 
  FROM Businesses 
  JOIN Bookmarks ON Bookmarks.BusinessID = Businesses.ID
  WHERE Bookmarks.UserEmail = '${user}'
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
};

function addBookmark(req, res) {
  var email = req.body.userEmail.toLowerCase();
  var businessID = req.body.businessID;
  console.log("in addBookmark email " + email + " " + businessID);
  var query = `INSERT INTO Bookmarks(UserEmail, BusinessID) 
        VALUES ('${email}', '${businessID}');`
  connection.query(query, function (error, rows, fields) {
    if (error) {
      res.send({
        "status": 400,
        "failed": "error ocurred"
      })
    } else {
      res.send({
        "status": 200,
        "success": "bookmark added sucessfully"
      });
    }
  });
}

function removeBookmark(req, res) {
  var email = req.body.userEmail.toLowerCase();
  var businessID = req.body.businessID;
  var query = `
  DELETE FROM Bookmarks 
  WHERE UserEmail = '${email}' AND BusinessID ='${businessID}';
  `
  connection.query(query, function (error, rows, fields) {
    if (error) {
      res.send({
        "status": 400,
        "failed": "error ocurred"
      })
    } else {
      res.send({
        "status": 200,
        "success": "bookmark removed sucessfully"
      });
    }
  });
}

function getAreaAverage(req, res) {
  var inputPC = req.params.postalCode;
  var query = `SELECT AVG(Stars) as avg_area_rating
  FROM Businesses
  WHERE Businesses.PostalCode = ${inputPC}
  GROUP BY Businesses.PostalCode
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
};

function covidBanner(req, res) {
  var query = `
  SELECT CovidBanner AS output
  FROM CovidData 
  WHERE CovidBanner <> "FALSE" 
  ORDER BY RAND() LIMIT 5;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
};

function getSessionUser(req, res) {
  console.log("Session Email: " + req.session.email);
  var query = `SELECT email, username 
  FROM USERS 
  WHERE email = '${req.session.email.toLowerCase()}'
  `
  connection.query(query, function (error, rows, fields) {
    if (error) {
      res.send({
        "status": 400,
        "failed": "error ocurred"
      })
    } else {
      res.json(rows);
    }
  });
};

function logout(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  req.session.email = '';
  // res.redirect('http://localhost:3000/');
};

function covidBannerCity(req, res) {
  var city = req.params.selectedCity;
  var query = `
  SELECT CovidBanner AS output, name as BusinessName
  FROM CovidData cd 
  JOIN Businesses b ON cd.BusinessID = b.ID
  WHERE cd.CovidBanner <> "FALSE" AND b.City = '${city}'
  ORDER BY RAND() LIMIT 5;
`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  testGetCategories: testGetCategories,
  addNewUser: addNewUser,
  validateLogin: validateLogin,
  getCategoriesByCity: getCategoriesByCity,
  getCities: getCities,
  bestCategoriesPerCity: bestCategoriesPerCity,
  preCovidRating: preCovidRating,
  midCovidRating: midCovidRating,
  percentOpen: percentOpen,
  ToD: ToD,
  GrubHub: GrubHub,
  getRecs: getRecs,
  getCategories: getCategories,
  getAreaAverage: getAreaAverage,
  covidBanner: covidBanner,
  covidBannerCity: covidBannerCity,
  bookmarks: bookmarks,
  logout: logout,
  getSessionUser: getSessionUser,
  addBookmark: addBookmark,
  removeBookmark: removeBookmark
}
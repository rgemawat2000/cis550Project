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
      res.json(rows);
    }
  });
}

function getCategoriesByCity(req, res) {
  var inputCity = req.params.city;
  var query = `
  SELECT Category, COUNT(*) as Count
  FROM Categories 
  JOIN ReviewNoText ON Categories.BusinessID = ReviewNoText.BusinessID
  JOIN Businesses ON Businesses.ID = Categories.BusinessID
  WHERE City = '${inputCity}'
  GROUP BY Category
  ORDER BY COUNT(*) DESC
  LIMIT 10;
  `
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
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


function tempTableCovidRating(req, res) {
  console.log("in temp table");
  var query2 = `  
      CREATE TABLE IF NOT EXISTS citiesSum ENGINE=MEMORY
      SELECT city, Sum(CASE When ReviewsNoText.year < 2019 
       Then ReviewsNoText.Stars Else 0 End) as preSum, 
       Sum(CASE When ReviewsNoText.year < '2019' 
       Then 1 Else 0 End) as preCount, 
       Sum(CASE When ReviewsNoText.year >= '2019' 
       Then ReviewsNoText.Stars Else 0 End) as midSum, 
       Sum(CASE When ReviewsNoText.year >= '2019' 
       Then 1 Else 0 End) as midCount 
       FROM ReviewsNoText 
       JOIN Businesses ON Businesses.ID = ReviewsNoText.BusinessID 
       GROUP BY city;
      `;
  connection.query(query2, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("done making temp table");
      res.json(rows);
    }
  });
}

function preCovidRating(req, res) {
  var city = req.params.selectedCity;
  var query = `
  SELECT city, (citiesSum.preSum / citiesSum.preCount) as output
  FROM citiesSum
  WHERE citiesSum.city = '${city}';
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
  SELECT city, (citiesSum.midSum / citiesSum.midCount)as output
  FROM citiesSum
  WHERE citiesSum.city = '${city}';
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
  JOIN Businesses ON Businesses.ID = CovidData.BusinessID
  WHERE Grubhub = 'TRUE' AND Businesses.City = '${city}';
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

function getHomeCities(req, res) {
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
  WHERE email = '${user.email.toLowerCase()}' OR username = '${user.username}';
  `
  connection.query(query, async function (error, results, fields) {
    if (error) {
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
        var query = `
        INSERT INTO USERS(email, password, username) 
        VALUES ('${user.email.toLowerCase()}', '${encryptedPassword}', '${user.username}');
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
  var query = `
  SELECT * FROM USERS WHERE email = '${email}';
  `
  connection.query(query, async function (error, results, fields) {
    if (error) {
      res.send({
        "code": 400,
        "failed": "error ocurred"
      })
    } else {
      if (results.length > 0) {
        const comparision = await bcrypt.compare(password, results[0].password)
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
  var query = `
  SELECT DISTINCT Category AS category
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
  var query = `
  SELECT Businesses.Name as name, Businesses.Address as address,
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
  var query = `
      INSERT INTO Bookmarks(UserEmail, BusinessID) 
      VALUES ('${email}', '${businessID}');
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
  var query = `
  SELECT AVG(Stars) as avg_area_rating
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
  if (req.session.email === undefined) {
    res.send({
      "status": 404,
      "failed": "not authenticated"
    })
  } else {
    var query = `
    SELECT email, username 
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
  }
};

function logout(req, res) {
  req.session.email = '';
  var query1 = `  
  DROP TABLE IF EXISTS citiesSum;
  `;
  connection.query(query1, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("done logging out");
      res.json(rows);
    }
  });
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
  getHomeCities: getHomeCities,
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
  removeBookmark: removeBookmark,
  tempTableCovidRating: tempTableCovidRating,
}

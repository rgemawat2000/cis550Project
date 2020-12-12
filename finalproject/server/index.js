const bodyParser = require('body-parser');
const express = require('express');
var session = require('express-session');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	next();
  });
  
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	session({
		secret: "thisIsMySecret",
		cookie: {
			httpOnly: false,
			maxAge: 24 * 60 * 60 * 1000
		}
	})
);


app.get('/first10Categories', routes.testGetCategories);

app.post('/validateLogin', routes.validateLogin);

app.post('/register', routes.addNewUser);

//app.get('/topCategories/:city', routes.getCategoriesByCity);
app.get('/cities', routes.getCities);

app.get('/bestCategories/:selectedCity', routes.bestCategoriesPerCity);

app.get('/preCovidRating/:selectedCity', routes.preCovidRating);

app.get('/midCovidRating/:selectedCity', routes.midCovidRating);

app.get('/percentOpen/:selectedCity', routes.percentOpen);

app.get('/ToD/:selectedCity', routes.ToD);

app.get('/GrubHub/:selectedCity', routes.GrubHub);

app.get('/categories', routes.getCategories);

app.get('/bookmarks/:sessionEmail', routes.bookmarks);

app.get('/areaaverage/:postalCode', routes.getAreaAverage);

app.get('/recommendations/:postalCode/:category/:minRating/:delivery/:service/:useremail', routes.getRecs);

app.get('/covidBanner', routes.covidBanner);

app.get('/covidBanner/:selectedCity', routes.covidBannerCity);

app.get('/logout', routes.logout);

app.get('/getSessionUser', routes.getSessionUser);

app.post('/addBookmark', routes.addBookmark);

app.post('/removeBookmark', routes.removeBookmark);



app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
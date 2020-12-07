const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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

app.get('/areaaverage/:postalCode', routes.getAreaAverage);

app.get('/recommendations/:postalCode/:category/:minRating/:delivery/:service', routes.getRecs);

app.get('/covidBanner', routes.covidBanner);

app.get('/covidBanner/:selectedCity', routes.covidBannerCity);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
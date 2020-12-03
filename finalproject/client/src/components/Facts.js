import React from 'react';
import PageNavbar from './PageNavbar';
import BestGenreRow from './BestGenreRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Facts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCity: "",
			cities: [],
			categories: []
		};

		this.submitCity = this.submitCity.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	
	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/cities", {
			method: 'GET' // The type of HTTP request.
		  })
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(citiesList => {
			  if (!citiesList) return;
			  // Map each genreObj in genreList to an HTML element:
			  // A button which triggers the showMovies function for each genre.
			  let citiesDivs = citiesList.map((citiesObj, i) =>
			  	<option value={citiesObj.City}> {citiesObj.City} </option>
			  );
	  
			  this.setState({
				cities: citiesDivs
			  })
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}

	handleChange(e) {
		this.setState({
			selectedCity: e.target.value
		});
	}


	submitCity() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/bestCategories/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		  })
		    .then(res => res.json()) // Convert the response data to a JSON.
			.then(bestCatList => {
			  if (!bestCatList) return;
			  // Map each genreObj in genreList to an HTML element:
			  // A button which triggers the showMovies function for each genre.
			  let bestCatDivs = bestCatList.map((bestCatObj, i) =>
			  <BestGenreRow genre = {bestCatObj.genre} avg_rating = {bestCatObj.avg_rating} />

			  );

			  this.setState({
				categories: bestCatDivs
			  })
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}

	render() {

		return (
			<div className="Facts">

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="h5">Facts by City</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedCity} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	<option select value> -- select an option -- </option>
			            	{this.state.cities}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitCity}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Business Category</strong></div>
			            <div className="header"><strong>Average Rating</strong></div>
			          </div>
			          <div className="movies-container" id="results">
			            {this.state.categories}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}
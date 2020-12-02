import React from 'react';
import PageNavbar from './PageNavbar';
import BestGenreRow from './BestGenreRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Facts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			decades: [],
			genres: []
		};

		this.submitDecade = this.submitDecade.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	/* ---- Q3a (Best Genres) ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/decades", {
			method: 'GET' // The type of HTTP request.
		  })
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(decadesList => {
			  if (!decadesList) return;
			  // Map each genreObj in genreList to an HTML element:
			  // A button which triggers the showMovies function for each genre.
			  let decadesDivs = decadesList.map((decadeObj, i) =>
			  	<option value={decadeObj.decade}> {decadeObj.decade} </option>
			  );
	  
			  this.setState({
				decades: decadesDivs
			  })
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}

	handleChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	}

	/* ---- Q3b (Best Genres) ---- */
	submitDecade() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/bestGenres/" + this.state.selectedDecade, {
			method: 'GET' // The type of HTTP request.
		  })
		    .then(res => res.json()) // Convert the response data to a JSON.
			.then(bestGenresList => {
			  if (!bestGenresList) return;
			  // Map each genreObj in genreList to an HTML element:
			  // A button which triggers the showMovies function for each genre.
			  let bestGenresDivs = bestGenresList.map((bestGenresObj, i) =>
			  	<BestGenreRow genre = {bestGenresObj.genre} avg_rating = {bestGenresObj.avg_rating} />
			  );

			  this.setState({
				genres: bestGenresDivs
			  })
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}

	render() {

		return (
			<div className="BestGenres">

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="h5">Facts by City</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedDecade} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	<option select value> -- select an option -- </option>
			            	{this.state.decades}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitDecade}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Genre</strong></div>
			            <div className="header"><strong>Average Rating</strong></div>
			          </div>
			          <div className="movies-container" id="results">
			            {this.state.genres}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}
import React from 'react';
import BestGenreRow from './BestGenreRow';
import SingleOutputRow from './SingleOutputRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Facts.css';
import PageNavbar from './PageNavbar';


export default class Facts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCity: "",
			cities: [],
			categories: [],
			preCovidRating: [],
			midCovidRating: [],
			percentOpen: [],
			ToD: [],
			GrubHub: []
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
				let citiesDivs = citiesList.map((citiesObj, i) =>
					<option key={i} value={citiesObj.City}> {citiesObj.City} </option>
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
		//TOP10 CATEGORIES IN CITY
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
					<BestGenreRow genre={bestCatObj.genre} avg_rating={bestCatObj.avg_rating} />

				);

				this.setState({
					categories: bestCatDivs
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.

		//PRECOVID RATING
		fetch("http://localhost:8081/preCovidRating/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(pCRatingList => {
				if (!pCRatingList) return;
				// Map each genreObj in genreList to an HTML element:
				// A button which triggers the showMovies function for each genre.
				let pCRatingDivs = pCRatingList.map((pCRatingObj, i) =>
					<SingleOutputRow output={pCRatingObj.output} />

				);

				this.setState({
					preCovidRating: pCRatingDivs
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.

		//MIDCOVID RATING
		fetch("http://localhost:8081/midCovidRating/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(mCRatingList => {
				if (!mCRatingList) return;
				// Map each genreObj in genreList to an HTML element:
				// A button which triggers the showMovies function for each genre.
				let mCRatingDivs = mCRatingList.map((mCRatingObj, i) =>
					<SingleOutputRow output={mCRatingObj.output} />

				);

				this.setState({
					midCovidRating: mCRatingDivs
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.

		//PERCENT OF BUSINESSES OPEN
		fetch("http://localhost:8081/percentOpen/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(percentOpenList => {
				if (!percentOpenList) return;
				// Map each genreObj in genreList to an HTML element:
				// A button which triggers the showMovies function for each genre.
				let percentOpenDivs = percentOpenList.map((percentOpenObj, i) =>
					<SingleOutputRow output={percentOpenObj.output * 100} />
				);

				this.setState({
					percentOpen: percentOpenDivs
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.

		//NUMBER OF BUSINESSES W TAKEOUT OR DELIVERY
		fetch("http://localhost:8081/ToD/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(ToDList => {
				if (!ToDList) return;
				// Map each genreObj in genreList to an HTML element:
				// A button which triggers the showMovies function for each genre.
				let ToDDivs = ToDList.map((ToDObj, i) =>
					<SingleOutputRow output={ToDObj.output} />

				);

				this.setState({
					ToD: ToDDivs
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.

		//NUMBER OF BUSINESSES W GRUBHUB
		fetch("http://localhost:8081/GrubHub/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(GrubHubList => {
				if (!GrubHubList) return;
				// Map each genreObj in genreList to an HTML element:
				// A button which triggers the showMovies function for each genre.
				let GrubHubDivs = GrubHubList.map((GrubHubObj, i) =>
					<SingleOutputRow output={GrubHubObj.output} />

				);

				this.setState({
					GrubHub: GrubHubDivs
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}

	render() {

		return (
			<div>
				<PageNavbar active="facts" />

				<div id="page-wrapper" class="container">
					<div class="row">
						<div class="col-lg-12">
							<h1>Facts</h1>
							<div class="alert alert-info"> Select city to get relevant statistics </div>
						</div>
					</div>

					<div class="row">
						<div className="col-sm-3">
							<select class="form-control select2" value={this.state.selectedCity} onChange={this.handleChange} id="decadesDropdown">
								<option> -- Select a City -- </option>
								{this.state.cities}
							</select>
						</div>
						<div class="col-sm-6">
							<button className="btn btn-danger" id="decadesSubmitBtn" onClick={this.submitCity}>Submit</button>
						</div>
					</div>


					<div class="row">
						<div class="col-lg-4">
							<div class="card">
								<div class="card-header">
									Top 10 Rated Businesses By Categories
  								</div>
								<div class="card-body">
									<div className="movies-container" id="results">
										{this.state.categories}
									</div>
								</div>
							</div>
						</div>

						<div class="col-lg-4">
							<div class="card">
								<div class="card-header">
									Overall Businesses Stats
  								</div>
								<div class="card-body">
									{/* <h5 class="card-title">Special title treatment</h5>
									<p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
									<a href="#" class="btn btn-primary">Go somewhere</a> */}
									<div className="movies-container">
										<div className="movie">
											<div className="header"><strong>Percentage of Businesses Open </strong></div>
										</div>
										<div className="movies-container" id="results">
											{this.state.percentOpen}
										</div>
									</div>
									<div className="movies-container">
										<div className="movie">
											<div className="header"><strong>Number of Businesses Offering Takeout/Delivery</strong></div>
										</div>
										<div className="movies-container" id="results">
											{this.state.ToD}
										</div>
									</div>
									<div className="movies-container">
										<div className="movie">
											<div className="header"><strong>Number of Businesses on GrubHub</strong></div>
										</div>
										<div className="movies-container" id="results">
											{this.state.GrubHub}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="col-lg-4">
							<div class="card">
								<div class="card-header">
									Average Ratings
  								</div>
								<div class="card-body">
									<div className="movies-container">
										<div className="movie">
											<div className="header"><strong>Overall Average</strong></div>
											{/* <div className="header"><strong>need to change -> just gives overall average</strong></div> */}
										</div>
										<div className="movies-container" id="results">
											{this.state.preCovidRating}
										</div>
									</div>
									<div className="movies-container">
										<div className="movie">
											<div className="header"><strong>Recent Average (2019 to Present)</strong></div>
											{/* <div className="header"><strong>need to change -> just gives overall average</strong></div> */}
										</div>
										<div className="movies-container" id="results">
											{this.state.midCovidRating}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* <div className="Facts">
					<div className="container bestgenres-container">
						<div className>
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
									<div className="header"><strong>Top 10 Best Rated Business Categories</strong></div>
									<div className="header"><strong>Average Rating</strong></div>
								</div>
								<div className="movies-container" id="results">
									{this.state.categories}
								</div>
							</div>
							<div className="movies-container">
								<div className="movie">
									<div className="header"><strong>Pre-COVID Average Rating</strong></div>
									<div className="header"><strong>need to change  -> just gives overall average</strong></div>
								</div>
								<div className="movies-container" id="results">
									{this.state.preCovidRating}
								</div>
							</div>
							<div className="movies-container">
								<div className="movie">
									<div className="header"><strong>Mid-COVID Average Rating</strong></div>
									<div className="header"><strong>need to change  -> just gives overall average</strong></div>
								</div>
								<div className="movies-container" id="results">
									{this.state.preCovidRating}
								</div>
							</div>
							<div className="movies-container">
								<div className="movie">
									<div className="header"><strong>Percentage of Businesses Open </strong></div>
								</div>
								<div className="movies-container" id="results">
									{this.state.percentOpen}
								</div>
							</div>
							<div className="movies-container">
								<div className="movie">
									<div className="header"><strong>Number of Businesses Offering Takeout/Delivery</strong></div>
								</div>
								<div className="movies-container" id="results">
									{this.state.ToD}
								</div>
							</div>
							<div className="movies-container">
								<div className="movie">
									<div className="header"><strong>Number of Businesses on GrubHub</strong></div>
								</div>
								<div className="movies-container" id="results">
									{this.state.GrubHub}
								</div>
							</div>
						</div>
					</div>
				</div> */}
			</div>
		);
	}
}
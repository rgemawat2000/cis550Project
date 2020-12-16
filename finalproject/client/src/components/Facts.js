import React from 'react';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Facts.css';
import PageNavbar from './PageNavbar';
import SingleOutputRow from './SingleOutputRow';
import RatingRow from './RatingRow';


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
		this.renderList = this.renderList.bind(this);
		this.getSessionUser = this.getSessionUser.bind(this);
	}

	getSessionUser() {
		fetch("http://localhost:8081/getSessionUser", {
			method: 'GET',
			credentials: 'include'
		})
			.then(res => res.json())
			.then(user => {
				if (JSON.parse(JSON.stringify(user)).status === 404) {
					window.location.assign("http://localhost:3000/");
				}
				if (user.length > 0) {
					this.setState({
						sessionEmail: user[0].email,
						sessionUsername: user[0].username
					})
				}
			})
			.catch(err => console.log(err))
	}


	componentDidMount() {
		this.getSessionUser();
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
					<RatingRow key={i} genre={bestCatObj.genre} avg_rating={bestCatObj.avg_rating} />

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
					<SingleOutputRow key={i} output={pCRatingObj.output} />
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
					<SingleOutputRow key={i} output={mCRatingObj.output} />

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
					<SingleOutputRow key={i} output={percentOpenObj.output * 100} />
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
					<SingleOutputRow key={i} output={ToDObj.output} />

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

	renderList(resultList) {
		if (Array.isArray(resultList)) {
			return (
				<table>
					<tbody>
						{resultList.map(((value, i) => (
							<tr key={i}>
								<td>
									<span className="user-subhead">{value.genre}  </span>
								</td>
								<td>
									{value.avg_rating}
								</td>
							</tr>
						)))}
					</tbody>
				</table>
			)
		}
	}

	render() {

		return (
			<div>
				<PageNavbar active="facts" />

				<div id="page-wrapper" className="container">
					<div className="row">
						<div className="col-lg-12">
							<h1>Facts</h1>
							<div className="alert alert-info"> Select city to get relevant statistics </div>
						</div>
					</div>

					<div className="row">
						<div className="col-sm-3">
							<select className="form-control select2" value={this.state.selectedCity} onChange={this.handleChange} id="decadesDropdown">
								<option> -- Select a City -- </option>
								{this.state.cities}
							</select>
						</div>
						<div className="col-sm-6">
							<button className="btn btn-danger" id="decadesSubmitBtn" onClick={this.submitCity}>Submit</button>
						</div>
					</div>


					<div className="row">
						<div className="col-lg-4">
							<div className="card">
								<div className="card-header">
									Top 10 Rated Business Categories
  								</div>
								<div className="card-body">
									<div className="movies-container" id="results">
										<table> <tbody>
											{this.state.categories}
										</tbody></table>
									</div>
								</div>
							</div>
						</div>

						<div className="col-lg-4">
							<div className="card">
								<div className="card-header">
									Overall Businesses Stats
  								</div>
								<div className="card-body">
									<table>
										<tbody>
											<tr>
												<td className="tRow">
													<strong>Percentage of Businesses Open </strong>
												</td>
												<td className="tRow">
													{this.state.percentOpen}
												</td>
											</tr>
											<tr>
												<td className="tRow">
													<strong>Number of Businesses Offering Takeout/Delivery</strong>
												</td>
												<td className="tRow">
													{this.state.ToD}
												</td>
											</tr>
											<tr>
												<td className="tRow">
													<strong>Number of Businesses on GrubHub</strong>
												</td>
												<td className="tRow">
													{this.state.GrubHub}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>

						<div className="col-lg-4">
							<div className="card">
								<div className="card-header">
									Average Ratings
  								</div>
								<div className="card-body">
									<table>
										<tbody>
											<tr >
												<td className="tRow">
													<strong>Average Pre-2019</strong>
												</td>
												<td className="tRow">
													{this.state.preCovidRating}

												</td>
											</tr>
											<tr className="tRow">
												<td className="tRow">
													<strong>Recent Average (2019 to Present)</strong>
												</td>
												<td className="tRow">
													{this.state.midCovidRating}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
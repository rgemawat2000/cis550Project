import React from 'react';
import BookmarkRow from './BookmarkRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/BestGenres.css';
import PageNavbar from './PageNavbar';


export default class Bookmark extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userEmail: "rgemawat@sas.upenn.edu",
			bookmarks: [],
		};
		this.handleChange = this.handleChange.bind(this);
	}


	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/bookmarks" + this.state.userEmail, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(bookmarksList => {
				if (!bookmarksList) return;
				// Map each genreObj in genreList to an HTML element:
				// A button which triggers the showMovies function for each genre.
				let bookmarksDivs = bookmarksList.map((bookmarksObj, i) =>
					<BookmarkRow name={bookmarksObj.name} address={bookmarksObj.address} city={bookmarksObj.city} state={bookmarksObj.state} stars={bookmarksObj.stars}/>

				);

				this.setState({
					bookmarks: bookmarksDivs
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.

	}

	handleChange(e) {
		this.setState({
			userEmail: e.target.value
		});
	}


	render() {

		return (
			<div>
				<PageNavbar active="bookmark" />

				<div id="page-wrapper" class="container">
					<div class="row">
						<div class="col-lg-12">
							<h1>Your Bookmarked Restaurants</h1>
						</div>
					</div>




					<div class="row">
						<div class="col-lg-4">
							<div class="card">

								<div class="card-body">
									<div className="movies-container" id="results">
										{this.state.bookmarks}
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
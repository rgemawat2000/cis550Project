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
			sessionEmail: "",
			sessionUsername: "",
			bookmarks: [],
		};
		this.handleChange = this.handleChange.bind(this);
		this.getSessionUser = this.getSessionUser.bind(this);
	}

	componentDidMount() {
		this.getSessionUser();
		// Send an HTTP request to the server.
	}

	handleChange(e) {
		this.setState({
			userEmail: e.target.value
		});
	}

	getSessionUser() {
		fetch("http://localhost:8081/getSessionUser", {
			method: 'GET',
			credentials: 'include'
		})
			.then(res => res.json())
			.then(user => {
				console.log(user);
				if (user.length > 0) {
					console.log('Session Email: ' + user[0].email);
					console.log('Session username: ' + user[0].username);
					this.setState({
						sessionEmail: user[0].email,
						sessionUsername: user[0].username
					})
				}
			})
			.catch(err => console.log(err))
	}


	render() {

		return (
			<div>
				<PageNavbar active="bookmark" />

				<div id="page-wrapper" class="container">
					<div class="row">
						<div class="col-lg-12">
							<h1>{this.state.sessionUsername}'s Bookmarked Restaurants</h1>
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
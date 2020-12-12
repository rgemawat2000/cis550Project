import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			postalCode: "",
			recValues: [],
			selectedCategory: "",
			categories: [],
			minRating: "",
			areaAverage: "",
			selectedDelivery: "",
			selectedService: "",
			sessionEmail: "",
			sessionUsername: "",
			disabledBtn: []
		}

		this.handlePostalChange = this.handlePostalChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleRatingChange = this.handleRatingChange.bind(this);
		this.handleDeliveryChange = this.handleDeliveryChange.bind(this);
		this.handleServiceChange = this.handleServiceChange.bind(this);
		this.submitInput = this.submitInput.bind(this);
		this.getSessionUser = this.getSessionUser.bind(this);
		this.addBookmark = this.addBookmark.bind(this);
		this.removeBookmark = this.removeBookmark.bind(this);

		// this.renderResults = this.renderResults.bind(this);

	}

	handlePostalChange(e) {
		this.setState({
			postalCode: e.target.value
		});
	}

	handleCategoryChange(e) {
		this.setState({
			selectedCategory: e.target.value
		});
	}

	handleRatingChange(e) {
		this.setState({
			minRating: e.target.value
		});
	}

	handleDeliveryChange(e) {
		this.setState({
			selectedDelivery: e.target.value
		});
	}

	handleServiceChange(e) {
		this.setState({
			selectedService: e.target.value
		});
	}

	componentDidMount() {
		this.getSessionUser();
		fetch(`http://localhost:8081/categories`, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json())
			.then(recCategoriesList => {
				let recCategoriesDivs = recCategoriesList.map((category, i) =>
					<option value={category.category} key={i}>{category.category}</option>
				);
				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					categories: recCategoriesDivs
				});
			})
			.catch(err => console.log(err))

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

	addBookmark(businessID, i) {
		var reqBody = {
			"userEmail": this.state.sessionEmail,
			"businessID": businessID,
		}
		console.log('in addBookmark' + reqBody);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
			credentials: 'include'
		};
		fetch("http://localhost:8081/addBookmark", requestOptions)
			.then(res => res.json())
			.then((code) => {
				var msg = JSON.parse(JSON.stringify(code)).status;
				if (msg === 200) {
					console.log("added bookmark");
					this.setState({
						disabledBtn: [...this.state.disabledBtn, i]
					});
					console.log("hello" + this.state.disabledBtn);
				} else if (msg === 400) {
					console.log("error in add bookmark");
				}
			})
			.catch(err => console.log(err))
	}

	removeBookmark(businessID) {
		var reqBody = {
			"userEmail": this.state.sessionEmail,
			"businessID": businessID,
		}
		console.log('in removeBookmark' + reqBody);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqBody),
			credentials: 'include'
		};
		fetch("http://localhost:8081/removeBookmark", requestOptions)
			.then(res => res.json())
			.then((code) => {
				var msg = JSON.parse(JSON.stringify(code)).status;
				if (msg === 200) {
					console.log("removed bookmark");
				} else if (msg === 400) {
					console.log("error in remove bookmark");
				}
			})
			.catch(err => console.log(err))
	}

	submitInput() {
		if (this.state.minRating === "") {
			this.state.minRating = "0"
		}
		fetch(`http://localhost:8081/recommendations/${this.state.postalCode}/${this.state.selectedCategory}/${this.state.minRating}/${this.state.selectedDelivery}/${this.state.selectedService}/${this.state.sessionEmail}`, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json())
			.then(recValuesList => {
				let recValuesDivs = recValuesList.map((value, i) =>
					<tr key={i}>
						<td>
							<span class="user-subhead">{value.name}  </span>
						</td>
						<td>
							{value.address}
						</td>
						<td>
							{value.rating}
						</td>
						<td>
							{value.abv_avg}
						</td>
						<td>
							{value.open === 1 ?
								<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check-square-fill" fill="green" xmlns="http://www.w3.org/2000/svg">
									<path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
								</svg> :
								<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-square-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
									<path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
								</svg>}
						</td>
						<td>
							{
								value.hasBookmark === null ?
									<button className="btn btn-info" id="addBookmarksBtn" disabled={this.state.disabledBtn.includes(i)}
										onClick={() => this.addBookmark(value.ID)}>Add</button>
									: <span />
							}
							{/* <button className="btn btn-alert" id="removeBookmarksBtn" onClick={() => this.removeBookmark(value.ID)}>Remove from Bookmarks</button> */}
							{/* <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star" fill="cadetblue" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
							</svg> */}
						</td>
					</tr>
				);
				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					recValues: recValuesDivs
				});
			})
			.catch(err => console.log(err))

		fetch(`http://localhost:8081/areaaverage/${this.state.postalCode}`, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json())
			.then(recValuesList => {
				let ratingDivs = recValuesList.map((value, i) =>
					value.avg_area_rating
				);
				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					areaAverage: "Area's Average Rating: " + Math.round((ratingDivs[0] + Number.EPSILON) * 100) / 100
				});
			})
			.catch(err => console.log(err))
	}

	render() {
		return (
			<div className="Recommendations">
				<PageNavbar active="recommendations" />

				<div id="page-wrapper" class="container">
					<div class="row">
						<div class="col-lg-12">
							<h1>Recommendations</h1>
							<div class="alert alert-info"> Select options to get recommendations </div>
						</div>
					</div>

					<div class="row">
						<div className="col-sm-2">
							<input type="text" class="form-control" placeholder="Enter Postal Code" value={this.state.postalCode}
								aria-label="Username" aria-describedby="basic-addon1" onChange={this.handlePostalChange} id="postalCode" />
						</div>
						<div className="col-sm-3">
							<select class="form-control select2" value={this.state.selectedCategory}
								onChange={this.handleCategoryChange} id="categoriesDropdown">
								<option select value> -- Select a Category -- </option>
								{this.state.categories}
							</select>
						</div>
						<div className="col-sm-4">
							<select class="form-control select2" value={this.state.selectedService} onChange={this.handleServiceChange} id="servicesDropdown">
								<option select value> -- Virtual Services Offered ? -- </option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>
						</div>

					</div>
					<div class="row">
						<div className="col-sm-4">
							<select class="form-control select2" value={this.state.selectedDelivery} onChange={this.handleDeliveryChange} id="deliveryDropdown">
								<option select value> -- Delivery / Takeout Offered ?-- </option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>
						</ div>
						<div class="col-sm-3">
							<input type="text" class="form-control" placeholder="Enter Minimum Rating" value={this.state.minRating}
								aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleRatingChange} id="minRating" />
							{/* <input type='text' placeholder="Enter Minimum Rating" value={this.state.minRating} onChange={this.handleRatingChange} id="minRating" className="rating-input" /> */}
						</div>
						<div class="col-sm-3">
							<button className="btn btn-danger" id="submitInputBtn" onClick={this.submitInput}>Submit</button>

							{/* <button className="btn btn-danger" id="decadesSubmitBtn" onClick={this.submitCity}>Submit</button> */}
						</div>
					</div>

					<div className="areaAvg" id="area_average"> {this.state.areaAverage} </div>
					<div class="row">
						<div class="main-box no-header clearfix">
							<div class="main-box-body clearfix">
								<table class="table user-list">
									<thead>
										<tr>
											<th><span>Name </span></th>
											<th><span>Address </span></th>
											<th class="text-center"><span>Rating</span></th>
											<th><span>Above Area Average</span></th>
											<th><span>Open</span></th>
											<th><span>Bookmark</span></th>
											{/* <th>&nbsp;</th> */}
										</tr>
									</thead>
									<tbody>
										{this.state.recValues.length === 0 ? <tr> <td> No Results To Display </td> </tr> : this.state.recValues}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
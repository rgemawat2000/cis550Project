import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Bookmark.css';
import PageNavbar from './PageNavbar';
import { Redirect } from 'react-router-dom';

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
		this.removeBookmark = this.removeBookmark.bind(this);
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
				if (JSON.parse(JSON.stringify(user)).status === 404) {
					window.location.assign("http://localhost:3000/");
				}
				if (user.length > 0) {
					this.setState({
						sessionEmail: user[0].email,
						sessionUsername: user[0].username
					});

					fetch("http://localhost:8081/bookmarks/" + this.state.sessionEmail, {
						method: 'GET',
					})
						.then(res => res.json()) // Convert the response data to a JSON.
						.then(bookmarkList => {
							if (!bookmarkList) return;

							// let bookmarkDivs = bookmarkList.map((bookmarkObj, i) =>
							// 	<BookmarkRow name={bookmarkObj.name} address={bookmarkObj.address} city={bookmarkObj.city} state={bookmarkObj.state} stars={bookmarkObj.stars} />
							// );

							this.setState({
								bookmarks: bookmarkList
							})
						})
						.catch(err => console.log(err))
				} else {
					return <Redirect to="http://localhost:3000/" />;
				}
			})
			.catch(err => console.log(err))


	}

	removeBookmark(businessID) {
		var reqBody = {
			"userEmail": this.state.sessionEmail,
			"businessID": businessID,
		}
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
					// console.log("removed bookmark");
					var newBookmarks = this.state.bookmarks.filter(item => {
						return item.ID !== businessID
					}); 
					this.setState({
						bookmarks: newBookmarks
					});
				} else if (msg === 400) {
					console.log("error in remove bookmark");
				}
			})
			.catch(err => console.log(err))
	}

	renderList(bookmarkList) {
		if (Array.isArray(bookmarkList)) {
			return (
				bookmarkList.map(((item, i) => (
					<div class="row" key={i}>
						<div class="col-lg-8 mx-auto">
							<div class="card mb-4">
								<div class="card-header">
									<div class='row'>
										<div class="col-name">
											<h4>{item.name}</h4>
										</div>
										<div class="col" align="right">
											<button className="btn btn-warning" id="removeBookmarksBtn"
												onClick={() => this.removeBookmark(item.ID)}>Remove
											</button>
										</div>
									</div>
								</div>
								<div class="card-body p-3">
									<h5 > {item.name}</h5>
									<p> Address: {item.address + " " + item.city + " " + item.state}</p>
									<p class="font-italic"> Rating: {item.stars}</p>
								</div>
							</div>
						</div>
					</div>
				)))
			)
		} else {
			return (
				<div>
					<p> No bookmarked Businesses to show</p>
				</div>
			)
		}
	}

	render() {

		return (
			<div>
				<PageNavbar active="bookmarks" />
				<div class="container py-5">
					<header class="text-black">
						<div class="row py-5">
							<div class="col-lg-7 mx-auto">
								<h2>{this.state.sessionUsername}'s Bookmarked Businesses</h2>
							</div>
						</div>
					</header>
					{this.renderList(this.state.bookmarks)}
				</div>
			</div>
		);
	}
}
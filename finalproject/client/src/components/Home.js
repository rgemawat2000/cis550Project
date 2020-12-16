import React from 'react';
import '../style/Facts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Home.css';
import PageNavbar from './PageNavbar';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		// The state maintained by this React Component. 
		this.state = {
			// categoryList: []
			selectedCity: "",
			cities: [],
			covidBanner: [],
			cityNews: []
		}

		this.submitCity = this.submitCity.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderCovidBanner = this.renderCovidBanner.bind(this);
		this.strReplace = this.strReplace.bind(this);
		this.renderNews = this.renderNews.bind(this);
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


	// React function that is called when the page load.
	componentDidMount() {
		this.getSessionUser();
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/homecities", {
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
		})
	}

	submitCity() {
		// make covidBanner
		fetch("http://localhost:8081/covidBanner/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(covidBannerList => {
				if (!covidBannerList) return;
				// // Map each covidBannerObj in covidBannerList to an HTML element:
				this.setState({
					covidBanner: covidBannerList
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.

		// To query /v2/top-headlines
		const q = this.state.selectedCity + " covid";
		const apiKey = "6122cdc0cb94499e9a2e46e982ebc5f1";
		const url = `https://newsapi.org/v2/everything?qInTitle=+${q}&apiKey=${apiKey}&sortBy=popularity&pageSize=10`;
		const request = new Request(url);

		// fetch news
		fetch(request, {
			method: 'GET',
			// mode: 'no-cors'
		})
			.then(response => response.json())
			.then((news) => {
				if (news.totalResults === 0) {
					return;
				} else {
					this.setState({
						cityNews: news.articles
					})
					// console.log(this.state.cityNews);
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	strReplace(input) {
		var s = input.replace("+", ",");
		return s;
	}

	renderCovidBanner = (resultList) => {
		if (Array.isArray(resultList)) {
			return (
				resultList.map(((item, i) => (
					<li className="event" key={i}>
						<h3>{item.BusinessName}</h3>
						<p>{this.strReplace(item.output)}</p>
					</li>
				)))
			)
		} else {
			return (
				<div>
					<p> No offers to show</p>
				</div>
			)
		}
	}

	renderNews(newsList) {
		if (Array.isArray(newsList) && newsList.length !== 0) {
			return (
				newsList.map(((item, i) => (
					<div className="row" key={i}>
						<div className="col-lg-8 mx-auto">
							<div className="card mb-4">
								<div className="card-header">
									<div className='row'>
										<div className="col-name">
											<h4><a href={item.url} target="_blank">{item.title}</a></h4>
										</div>
									</div>
								</div>
								<div className="card-body p-3">
									<h5 > {item.description}</h5>
									<p>{item.content}</p>
									<p> Author: <i>{item.author}</i>  Source: <i>{item.source.name}</i></p>
								</div>
							</div>
						</div>
					</div>
				)))
			)
		} else {
			return (
				<div>
					<p> No news to show</p>
				</div>
			)
		}
	}

	render() {
		return (
			<div>
				<PageNavbar active="home" />

				<div id="page-wrapper" className="container">
					<div className="row">
						<div className="col-lg-12">
							<h1>Home</h1>
							<div className="alert alert-info"> Select a city to get Covid offers by local businesses </div>
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

					{this.state.covidBanner.length === 0 ? <span /> :
						<div>
							<div className="row">
								<div className="col-md-12">
									<div className="card">
										<div className="card-body">
											<h3 className="card-title">Covid Banners</h3>
											<div id="content">
												<ul className="timeline">
													{this.renderCovidBanner(this.state.covidBanner)}
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
									<div className="card">
										<h3 className="card-title" padding="15px">News from {this.state.selectedCity}</h3>
										{this.renderNews(this.state.cityNews)}
									</div>
								</div>
							</div>
						</div>
					}
				</div>
			</div >
		);
	}
}
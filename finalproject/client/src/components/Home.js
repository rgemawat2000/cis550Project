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
			covidBanner: []
		}

		this.submitCity = this.submitCity.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderCovidBanner = this.renderCovidBanner.bind(this);
		this.strReplace = this.strReplace.bind(this);
	}

	// React function that is called when the page load.
	componentDidMount() {
		// fetch("http://localhost:8081/covidBanner/", {
		// 	method: 'GET' // The type of HTTP request.
		// })
		// 	.then(res => res.json()) // Convert the response data to a JSON.
		// 	.then(covidBannerList => {
		// 		if (!covidBannerList) return;
		// 		// Map each covidBannerObj in covidBannerDivs to an HTML element:
		// 		let covidBannerDivs = covidBannerList.map((covidBannerObj, i) =>
		// 			<SingleOutputRow output={covidBannerObj.output} />
		// 		);

		// 		this.setState({
		// 			covidBanner: covidBannerDivs
		// 		})
		// 	})
		// 	.catch(err => console.log(err))	// Print the error if there is one.

		var msg = "aaa+";
		msg = msg.replace("+", ",");
		console.log(msg);
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
				// console.log(covidBannerList);
				// // Map each covidBannerObj in covidBannerList to an HTML element:
				this.setState({
					covidBanner: covidBannerList
				})
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}

	strReplace(input) {
		var s = input.replace("+", ",");
		console.log(s);
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
					}

				</div>
			</div >
		);
	}
}
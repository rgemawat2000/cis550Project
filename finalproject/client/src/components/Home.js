import React from 'react';
import '../style/Facts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SingleOutputRow from './SingleOutputRow';

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
    }

    // React function that is called when the page load.
    componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/covidBanner/", {
			method: 'GET' // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(covidBannerList => {
				if (!covidBannerList) return;
				// Map each covidBannerObj in covidBannerDivs to an HTML element:
				let covidBannerDivs = covidBannerList.map((covidBannerObj, i) =>
					<SingleOutputRow output={covidBannerObj.output} />
				);

				this.setState({
					covidBanner: covidBannerDivs
				})
			})
            .catch(err => console.log(err))	// Print the error if there is one.
            
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

    submitCity () {
    // make covidBanner
		fetch("http://localhost:8081/covidBanner/" + this.state.selectedCity, {
			method: 'GET' // The type of HTTP request.
		})
            .then(res => res.json()) // Convert the response data to a JSON.
            .then(covidBannerList => {
                if (!covidBannerList) return;
                // Map each covidBannerObj in covidBannerList to an HTML element:
                let covidBannerDivs = covidBannerList.map((covidBannerObj, i) =>
                    <SingleOutputRow output={covidBannerObj.output} />
                );

                this.setState({
                    covidBanner: covidBannerDivs
                })
            })
            .catch(err => console.log(err))	// Print the error if there is one.
        }

    // showCategoriesCity(city) {
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         credentials: 'include'
    //     };
    //     fetch("http://localhost:8081//topCategories/" + city, requestOptions)
    //         .then(res => res.json())
    //         .then((categoryList) => {
    //             if (!cities) return;
    //             let categoryL = genreList.map((categoryObj, i) =>
    //             <p> </p>
    //           );
      
    //           // Set the state of the genres list to the value returned by the HTTP response from the server.
    //           this.setState({
    //             categoryList: categoryL
    //           })
    //         })
    //         .catch(err => console.log(err))
    //     this.setState({
    //         email: '',
    //         password: ''
    //     });
    // }

    render() {
        return (
            <div>
				<PageNavbar active="home" />

				<div id="page-wrapper" class="container">
					<div class="row">
						<div class="col-lg-12">
							<h1>Home</h1>
							<div class="alert alert-info"> Select a city to get relevant Covid Banner </div>
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
									Covid Banner
  								</div>
								<div class="card-body">
									<div className="movies-container">
										<div className="movies-container" id="results">
											{this.state.covidBanner}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
        );
    }
}
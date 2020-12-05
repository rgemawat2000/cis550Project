import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
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
			selectedService: ""
		}

		this.handlePostalChange = this.handlePostalChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleRatingChange = this.handleRatingChange.bind(this);
		this.handleDeliveryChange = this.handleDeliveryChange.bind(this);
		this.handleServiceChange = this.handleServiceChange.bind(this);
		this.submitInput = this.submitInput.bind(this);
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
		fetch(`http://localhost:8081/categories`, {
      		method: 'GET' // The type of HTTP request.
    	})
    	.then(res => res.json())
    	.then(recCategoriesList => {
			let recCategoriesDivs = recCategoriesList.map((category, i) => 
				<option value={category.category}>{category.category}</option>
      		);
      		//This saves our HTML representation of the data into the state, which we can call in our render function
      		this.setState({
        		categories: recCategoriesDivs
      		});
    	})
    	.catch(err => console.log(err))
	}

	submitInput() {
		fetch(`http://localhost:8081/recommendations/${this.state.postalCode}/${this.state.selectedCategory}/${this.state.minRating}/${this.state.selectedDelivery}/${this.state.selectedService}`, {
      		method: 'GET' // The type of HTTP request.
    	})
    	.then(res => res.json())
    	.then(recValuesList => {
      		let recValuesDivs = recValuesList.map((value, i) => 
        		<div key={i} className="recResults">
					<div className="name">{value.name}</div>
					<div className="address">{value.address}</div>
					<div className="rating">{value.rating}</div>
					<div className="abvavg">{value.abv_avg}</div>
					<div className="open">{value.open}</div>
        		</div>
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
				areaAverage: "Area Average: "+ratingDivs[0]
      		});
    	})
    	.catch(err => console.log(err))
	}

	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="recommendations" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Recommendations</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Postal Code" value={this.state.postalCode} onChange={this.handlePostalChange} id="postalCode" className="postal-input"/>
			    			<div className="dropdown-container">
			            		<select value={this.state.selectedCategory} onChange={this.handleCategoryChange} className="dropdown" id="categoriesDropdown">
			            			<option select value> -- Select a Category -- </option>
			            			{this.state.categories}
			            		</select>
			          		</div>
							<div className="dropdown-container">
			            		<select value={this.state.selectedDelivery} onChange={this.handleDeliveryChange} className="dropdown" id="deliveryDropdown">
			            			<option select value> -- Delivery or Takeout -- </option>
			            			<option value="Yes">Yes</option>
									<option value="No">No</option>
			            		</select>
			          		</div>
							<div className="dropdown-container">
			            		<select value={this.state.selectedService} onChange={this.handleServiceChange} className="dropdown" id="servicesDropdown">
			            			<option select value> -- Virtual Services -- </option>
			            			<option value="Yes">Yes</option>
									<option value="No">No</option>
			            		</select>
			          		</div>
							<input type='text' placeholder="Enter Minimum Rating" value={this.state.minRating} onChange={this.handleRatingChange} id="minRating" className="rating-input"/>
							<button id="submitInputBtn" className="submit-btn" onClick={this.submitInput}>Submit</button>
			    		</div>
			    		<div className="header-container">
							<div className="h6" id="area_average">{this.state.areaAverage}</div>
			    			<div className="h6">We Recommend ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Name</strong></div>
			    				<div className="header"><strong>Address</strong></div>
					            <div className="header"><strong>Rating</strong></div>
					            <div className="header"><strong>Above Area Average</strong></div>
								<div className="header"><strong>Open</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recValues}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}
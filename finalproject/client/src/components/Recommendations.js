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
			recValues: []
		}

		this.handlePostalChange = this.handlePostalChange.bind(this);
		this.submitInput = this.submitInput.bind(this);
	}

	handlePostalChange(e) {
		this.setState({
			postalCode: e.target.value
		});
	}

	submitInput() {
		fetch(`http://localhost:8081/recommendations/${this.state.postalCode}`, {
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
        		</div>
      	);
      		//This saves our HTML representation of the data into the state, which we can call in our render function
      		this.setState({
        		recValues: recValuesDivs
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
			    			<button id="submitInputBtn" className="submit-btn" onClick={this.submitInput}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">We Recommend ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Name</strong></div>
			    				<div className="header"><strong>Address</strong></div>
					            <div className="header"><strong>Rating</strong></div>
					            <div className="header"><strong>Above Average</strong></div>
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
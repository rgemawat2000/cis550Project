import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="recResults">
				<div className="name">NAME</div>
				<div className="address">ADDRESS</div>
				<div className="rating">RATING</div>
				<div className="abvavg">ABOVE_AVERAGE</div>
				<div className="open">OPEN</div>
			</div>
		);
	}
}

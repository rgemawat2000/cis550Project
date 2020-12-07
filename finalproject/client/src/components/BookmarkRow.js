import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BookmarkRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="name">{this.props.name}</div>
				<div className="address">{this.props.address}</div>
                <div className="city">{this.props.city}</div>
                <div className="state">{this.props.state}</div>
                <div className="stars">{this.props.stars}</div>
			</div>
		);
	}
}

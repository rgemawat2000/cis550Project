import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SingleOutputRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="output">{this.props.output}</div>
			</div>
		);
	}
}

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenreRow extends React.Component {

	render() {
		return (
			<tr>
				<td>
					<span class="user-subhead">{this.props.genre}  </span>
				</td>
				<td>
					{this.props.avg_rating}
				</td>
			</tr>
		);
	}
}

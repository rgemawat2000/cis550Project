import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Facts.css';

export default class SingleOutputRow extends React.Component {
	render() {
		return (
			<tr>
				<td className="tRow">
					<span class="user-subhead">{this.props.BusinessName}  </span>
				</td>
				<td className="tRow">
					{this.props.output}
				</td>
			</tr>
		);
	}
}

import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Recommendations from './Recommendations';
import Login from './Login';
import Landing from './Landing';
import SignUp from './SignUp';
import Facts from './Facts';
import Home from './Home';
import Bookmark from './Bookmark';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Landing />
							)}
						/>
						<Route
							path="/recommendations"
							render={() => (
								<Recommendations />
							)}
						/>
						<Route
							path="/login"
							render={() => (
								<Login />
							)}
						/>
						<Route
							path="/sign-up"
							render={() => (
								<SignUp />
							)}
						/>

						<Route
							path="/facts"
							render={() => (
								<Facts />
							)}
						/>
						<Route
							path="/bookmarks"
							render={() => (
								<Bookmark />
							)}
						/>

						<Route
							path="/landing"
							render={() => (
								<Landing />
							)}
						/>
						<Route
							path="/sign-out"
							render={() => (
								<Landing />
							)}
						/>
						<Route
							path="/home"
							render={() => (
								<Home />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}
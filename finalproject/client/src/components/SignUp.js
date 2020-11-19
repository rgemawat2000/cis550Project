import React from 'react';
import '../style/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    // React function that is called when the page load.
    componentDidMount() {
    }

    render() {
        return (
            <form>
                <h3>Sign Up</h3>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" placeholder="Username" />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>

                <button type="submit" className="btn btn-info btn-block">Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered? <Link className="nav-link" to={"/login"}>Sign in</Link>
                </p>
            </form>
        );
    }
}
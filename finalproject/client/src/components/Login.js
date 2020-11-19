import React from 'react';
import '../style/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default class Login extends React.Component {
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
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>

                <button type="submit" className="btn btn-info btn-block">Submit</button>
                <p className="forgot-password text-right">
                    Don't have an account? <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                </p>
            </form>
        );
    }
}
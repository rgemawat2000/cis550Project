import React from 'react';
import '../style/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            errors: {
                email: '',
                password: '',
            },
            submission_errors: ''
        }

        this.submitLogin = this.submitLogin.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value
        });
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value
        });
    }

    submitLogin() {
        console.log('in submitLogin');
        var reqBody = {
            "email": this.state.email,
            "password": this.state.password
        }
        console.log(reqBody);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody),
            credentials: 'include'
        };
        fetch("http://localhost:8081/validateLogin", requestOptions)
            .then(res => res.json())
            .then((code) => {
                var msg = JSON.parse(JSON.stringify(code)).status;
                // console.log("res json code " + JSON.stringify(code));
                // console.log("res json status " + msg);
                if (msg === 200) {
                    console.log("SUCCESSS")
                    window.location.assign('/facts');
                    //redirect from here; 
                } else if (msg === 206) {
                    // console.log("Email does not exist")
                    this.setState({ submission_errors: 'Email does not exist' })
                } else if (msg === 204) {
                    // console.log("Email and password does not match")
                    this.setState({ submission_errors: 'Email and password does not match' })
                }
            })
            .catch(err => console.log(err))
        this.setState({
            email: '',
            password: ''
        });
    }

    // React function that is called when the page load.
    componentDidMount() {
    }

    handleChange = (event) => {
        const validEmailRegex =
            RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        event.preventDefault();
        const { name, value } = event.target;
        console.log(value);
        let errors = this.state.errors;
        switch (name) {
            case 'email':
                errors.email = validEmailRegex.test(value) ? '' : 'Email is not valid!';
                break;
            case 'password':
                errors.password = value.length < 6 ? 'Password must be 6 characters long!' : '';
                break;
            default:
                break;
        }
        // this.setState({ errors, [name]: value }, () => {
        //     console.log(errors)
        // })
        this.setState({ errors, [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateForm(this.state.errors)) {
            console.info('Valid Form');
            this.submitLogin();
        } else {
            console.error('Invalid Form');
        }
    }

    validateForm = (errors) => {
        console.log("in valdiateForm");
        let valid = true;
        Object.values(errors).forEach(
            // if we have an error string set valid to false
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    render() {
        const { errors } = this.state;
        const { submission_errors } = this.state;
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                <h3>Sign In</h3>
                <div className="email">
                    <label>Email</label>
                    <input type="email" name='email' className="form-control"
                        onChange={this.handleChange} placeholder="Enter email" noValidate />
                    {errors.email.length > 0 &&
                        <span className='error'>{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name='password' className="form-control"
                        onChange={this.handleChange} placeholder="Enter password" noValidate />
                    {errors.password.length > 0 &&
                        <span className='error'>{errors.password}</span>}
                </div>
                <div className='info'>
                    <small>Note: Password must be at least six characters in length.</small>
                </div>
                {/* <button type="submit" onClick={e => { e.preventDefault(); this.submitLogin() }} className="btn btn-info btn-block">Submit</button> */}
                <button type="submit" className="btn btn-info btn-block">Submit</button>
                <span className='error'>{submission_errors}</span>
                <p className="forgot-password text-right">
                    Don't have an account? <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                </p>
            </form>
        );
    }
}
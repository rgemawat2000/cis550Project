import React from 'react';
import '../style/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            username: "",
            errors: {
                email: '',
                password: '',
                username: ''
            },
            submission_errors: ''
        }

        this.submitSignUp = this.submitSignUp.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    // React function that is called when the page load.
    componentDidMount() {
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

    handleUsernameChange(e) {
        this.setState({
            username: e.target.value
        });
    }

    handleChange = (event) => {
        const validEmailRegex =
            RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'email':
                errors.email = validEmailRegex.test(value) ? '' : 'Email is not valid!';
                break;
            case 'password':
                errors.password = value.length < 6 ? 'Password must be 6 characters long!' : '';
                break;
            case 'username':
                errors.username = value.length < 3 ? 'Username must be 3 characters long!' : '';
            default:
                break;
        }
        this.setState({ errors, [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.email === "") {
            let errors = this.state.errors;
            errors.email = 'Email is empty';
        } else if (this.state.password === "") {
            let errors = this.state.errors;
            errors.password = 'Password is empty';
        } else {
            if (this.validateForm(this.state.errors)) {
                console.info('Valid Form');
                this.submitSignUp();
            } else {
                console.error('Invalid Form');
            }
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

    submitSignUp() {

        console.log('in submitSignUp');
        var reqBody = {
            "email": this.state.email,
            "password": this.state.password,
            "username": this.state.username
        }
        console.log(reqBody);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody),
            credentials: 'include'
        };
        fetch("http://localhost:8081/register", requestOptions)
            .then(res => res.json())
            .then((code) => {
                var msg = JSON.parse(JSON.stringify(code)).status;
                // console.log("res json code " + JSON.stringify(code));
                // console.log("res json status " + msg);
                if (msg === 200) {
                    console.log("SUCCESSS")
                    this.setState({ submission_errors: 'User registered successfully. Proceed to Login' })
                    //redirect from here; 
                } else if (msg === 206) {
                    // console.log("Email does not exist")
                    this.setState({ submission_errors: 'Email or username already in use' })
                }
            })
            .catch(err => console.log(err))
        this.setState({
            email: '',
            password: ''
        });
    }

    render() {
        const { errors } = this.state;
        const { submission_errors } = this.state;
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                <h3>Sign Up</h3>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control"
                        onChange={this.handleChange} placeholder="Username" noValidate />
                    {errors.username.length > 0 &&
                        <span className='error'>{errors.username}</span>}
                </div>
                <div className="form-group">
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
                    <small>Password must be at least six characters in length.</small>
                </div>
                <button type="submit" className="btn btn-info btn-block">Submit</button>
                <span className='error'>{submission_errors}</span>
                <p className="forgot-password text-right">
                    Already registered? <Link className="nav-link" to={"/login"}>Sign in</Link>
                </p>
            </form>
        );
    }
}
import axios from 'axios';
import React, { Component, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Route } from 'react-router';




class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '', password: ''
        }
        this.onChangeEmail = this.onChangeName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChangeName(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const newUser = { email: this.state.email, password: this.state.password };

        axios.post('http://localhost:5000/auth/signin', newUser).then(res => {
            console.log(res.data.user);
            alert(`hello ${res.data.user.name}, ${res.data.user.type}`);
            sessionStorage.setItem('userName', res.data.user.name);
            sessionStorage.setItem('userEmail', this.state.email);
            sessionStorage.setItem('userType', res.data.user.type);
        }).catch(err => {
            console.log(`err: ${err.response.data}`);
            alert(`from backend: ${err.response.data.msg}`);
        })
    }

    render() {
        return (
            <div>
                <h2>signin page</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Sign-In!" className="btn btn-primary" />
                    </div>

                </form>
            </div>


        )
    }
}

export default SignIn;
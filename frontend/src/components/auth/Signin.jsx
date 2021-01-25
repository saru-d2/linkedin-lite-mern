import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

export default class Signin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: {},
            errors: {}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    onChange(e) {
        e.preventDefault();
        // console.log(e.target.id);
        var tempData = this.state.userData;
        tempData[e.target.id] = e.target.value;
        this.setState({ userData: tempData });
    }

    validate() {
        let input = this.state.userData;
        let errors = {}
        let isValid = true;
        if (!input["email"]) {
            isValid = false;
            errors["email"] = "Please enter your email Address.";
        }

        if (typeof input["email"] !== "undefined") {

            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(input["email"])) {
                isValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }
        if (!input['password']) {
            isValid = false;
            errors['password'] = 'please enter password'
        }
        this.setState({
            errors: errors
        })
        return isValid;
    }

    onSubmit(e) {
        if (!this.validate()) {
            alert('give proper data pls')
            return
        }
        var subData = this.state.userData;
        axios.post('http://localhost:5000/auth/signin', subData).then(res => {
            console.log(res);
            if (res.status == 200){
                console.log('hi');
                this.props.onLogIn(res.data.token);
            }
            // alert('please continue');
            sessionStorage.setItem('userEmail', subData.email);
            window.location.replace('http://localhost:3000/');
        }).catch((err) => {
            console.log(err.response.data);
            alert(err.response.data.msg);
        })

    }


    render() {
        return (
            <div>
                <h1>login/ signin</h1>

                <div className='form-group'>
                    <label>email</label>
                    <input type='text' required id='email' onChange={this.onChange} />
                    <div className="text-danger">{this.state.errors.email}</div>
                </div>

                <div className='form-group'>
                    <label>password</label>
                    <input type='password' required id='password' onChange={this.onChange} />
                    <div className="text-danger">{this.state.errors.password}</div>
                </div>

                <div className='submitButton'>
                    <input type='button' value='sign in' onClick={this.onSubmit} />
                </div>

            </div>
        )
    }

}
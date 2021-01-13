import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
const axios = require('axios');

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirm: '',
            date: null,
            type: 'applicant',
            done: false
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }




    onChangeName(event) {
        this.setState({ name: event.target.value });
    }
    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangePasswordConfirm(event) {
        this.setState({ password_confirm: event.target.value });
    }

    onChangeType(event) {
        this.setState({ type: event.target.value });
    }

    onSubmit(e) {
        console.log("submit");
        e.preventDefault();
        console.log(this.state.email);
        if (this.state.email === '' || this.state.name === '' || this.state.password_confirm === '' || this.state.password === '') {
            console.log('whhhatt');
            alert(';-; enter proper data pls, what do you want me to do?');
            return;
        }

        if (this.state.password !== this.state.password_confirm){
            alert('passwords dont match')
            return;
        }

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm,
            date: Date.now(),
            type: this.state.type
        }
        axios.post('http://localhost:5000/auth/register', newUser)
            .then(res => {
                alert("succesfully added to database, please login\t" + res.data);
                console.log(res);
                sessionStorage.setItem('userType', newUser.type);
                sessionStorage.setItem('userName', newUser.name);
                sessionStorage.setItem('userEmail', newUser.email);
                console.log(this.state.done);
                this.setState({done:true});
                console.log(this.state.done);
            })
            .catch(err => {
                console.log(err);
                alert(`from backend:${err}`)
            });

        this.setState({
            name: '',
            email: '',
            date: null
        });
    }

    render() {
        if (this.state.done) {
            if (this.state.type == 'applicant')
            return (<Redirect to='/registerApplicant' />)
            else return(<Redirect to='registerRecruiter'/>)
        }
        
        return (
            <div style={{ marginLeft: '5%', marginRight: '20%' }}>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.name}
                            onChange={this.onChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                        />
                    </div>
                    <div className="form-group">
                        <label>password </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                    </div>
                    <div className="form-group">
                        <label>confirm password </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.password_confirm}
                            onChange={this.onChangePasswordConfirm}
                        />
                    </div>
                    <div className="form-group">
                        <label>Type of user </label>
                        <select className="form-control" onChange={this.onChangeType} value={this.state.type}>
                            <option value="applicant" selected>applicant</option>
                            <option value="recruiter">recruiter</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </div>
                </form>

                {/* *{this.state.done}*
                {
                    this.state.done && (
                        <Redirect to={'/registerApplicant'} />
                    )
                } */}
            </div>
        )
    }
}
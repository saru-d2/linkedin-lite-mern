import React, { Component, useState } from 'react';
import '../../App.css'
const axios = require('axios');

export default class RecruiterRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: {},
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    onChange(e) {
        e.preventDefault();
        console.log(e.target.id);
        var tempData = this.state.userData;
        tempData[e.target.id] = e.target.value;
        this.setState({ userData: tempData });
    }


    onSubmit(e) {
        const email = this.props.match.params.id;

        var subOb = this.state.userData;
        subOb['email'] = email;
        axios.post('http://localhost:5000/auth/register/recruiter', subOb)
            .then(res => {

                alert('Done! please continue to signin!');
                window.location.replace('http://localhost:3000/signin/');

            }).catch(err => {
                console.log(err.response.data);
                alert(`from backend ${err}`);
                this.setState({ errors: err.response.data });
            })
    }

    render() {
        return (
            <div>
                <div className='form-group row'>
                    <label className='col-lg-3'>contact number</label>
                    <div className='col-lg-7'>
                        <input type='text' required id='contactNumber' onChange={this.onChange} />
                        <div className="text-danger">{this.state.errors.contactNumber}</div>
                    </div>
                </div>
                <div className='form-group'>
                    <label>Bio</label>
                    <textarea
                        className="form-control"
                        id="Bio"
                        rows="5"
                        onChange={this.onChange}
                    />
                    <div className="text-danger">{this.state.errors.Bio}</div>
                </div>
                <div className='submitButton'>
                    <input type='button'  className='btn shadow-move red' value='register' onClick={this.onSubmit} />
                </div>
            </div>
        )
    }
}
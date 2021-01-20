import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../../App.css'
const axios = require('axios');

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: { type: 'applicant' },
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


  onSubmit() {
    //some validation
    var subData = this.state.userData;
    axios.post('http://localhost:5000/auth/register', subData)
      .then(res => {
        alert('please continue');
        sessionStorage.setItem('userEmail', subData.email);
        console.log(res);
        if (subData.type === 'applicant')
          window.location.replace('http://localhost:3000/registerApplicant/' + subData.email);
        else
          window.location.replace('http://localhost:3000/registerRecruiter/' + subData.email);
      }).catch((err) => {
        if (err) {
          alert('error in data!')
          this.setState({errors: err.response.data});
        }
      })

  }
  render() {
    return (

      <div>
        <div className='form-group'>
          <label>Name</label>
          <input type='text' required id='name' onChange={this.onChange} />
          <div className="text-danger">{this.state.errors.name}</div>
        </div>

        <div className='form-group'>
          <label>email</label>
          <input type='text' required id='email' onChange={this.onChange} />
          <div className="text-danger">{this.state.errors.email}</div>

        </div>

        <div className='form-group'>
          <label>password</label>
          <input type='text' required id='password' onChange={this.onChange} />
          <div className="text-danger">{this.state.errors.password}</div>
        </div>

        <div className='form-group'>
          <label>password_confirm</label>
          <input type='text' required id='password_confirm' onChange={this.onChange} />
          <div className="text-danger">{this.state.errors.password_confirm}</div>

        </div>

        <div className='form-group'>
          <label>userType</label>
          <select className="form-control" onChange={this.onChange} id='type' >
            <option value="applicant" selected>applicant</option>
            <option value="recruiter">recruiter</option>
          </select>
        </div>


        <div className='submitButton'>
          <input type='button' value='register' onClick={this.onSubmit} />
        </div>
        {JSON.stringify(this.state.userData)}
      </div>


    )
  }
}
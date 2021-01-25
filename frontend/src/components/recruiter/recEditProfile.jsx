import React, { Component } from 'react'
import axios from 'axios'

export default class RecEditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recruiter: {},
            name: '',
            Bio: '',
            contactNumber: '',
            Loading: true,
            errors: true,
        }
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeBio = this.onChangeBio.bind(this)
        this.onChangeContactNumber = this.onChangeContactNumber.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        axios.post('http://localhost:5000/recruiter/getRecruiterUser').then(res => {
            this.setState({
                recruiter: res.data,
                Loading: false,
            });
            this.setState({
                name: this.state.recruiter.user.name,
                Bio: this.state.recruiter.Bio,
                contactNumber: this.state.recruiter.contactNumber
            })
        }).catch(e => {
            console.log(e);
        })
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        })
    }
    onChangeBio(e) {
        this.setState({
            Bio: e.target.value
        })
    }
    onChangeContactNumber(e) {
        this.setState({
            contactNumber: e.target.value
        })
    }

    onSubmit(e) {
        var req = { name: this.state.name, Bio: this.state.Bio, contactNumber: this.state.contactNumber }
        console.log(req)
        axios.post('http://localhost:5000/recruiter/editProfile', req)
    }

    render() {
        if (this.state.Loading) return (<h1>Loading</h1>)


        return (
            <div>
                <h1>rec edit profile</h1>
                <div className='form-group'>
                    <label>Name</label>
                    <input type='text' value={this.state.name} required id='name' onChange={this.onChangeName} />
                    <div className="text-danger">{this.state.errors.name}</div>
                </div>

                <div className='form-group'>
                    <label>contact number </label>
                    <input type='text' value={this.state.contactNumber} required id='name' onChange={this.onChangeContactNumber} />
                    <div className="text-danger">{this.state.errors.name}</div>
                </div>

                <div className='form-group'>
                    <label>Bio </label>
                    <textarea
                        className="form-control"
                        id="Bio"
                        rows="5"
                        value={this.state.Bio}
                        onChange={this.onChangeBio}
                    />
                    <div className="text-danger">{this.state.errors.name}</div>
                </div>


                <button onClick={this.onSubmit}>edit!</button>

                {JSON.stringify(this.state.recruiter)}
                {JSON.stringify(this.state.name)}
                {JSON.stringify(this.state.Bio)}
                {JSON.stringify(this.state.contactNumber)}
            </div>
        )
    }
}
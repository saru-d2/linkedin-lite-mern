import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Creatable from 'react-select/creatable';
import DatePicker from 'react-date-picker'

const defaultLangs = [
    { label: "C", value: "C" }, { label: "C++", value: "C++" }, { label: "python", value: "python" }, { label: "java", value: "java" }
]

export default class AddJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobData: {
                email: this.props.userEmail,
                jobType: 'Full-time',
                skills: []
            },
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeSkills = this.onChangeSkills.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }


    onChange(e) {
        e.preventDefault();
        // console.log(e.target.id);
        var tempData = this.state.jobData;
        tempData[e.target.id] = e.target.value;
        this.setState({ jobData: tempData });
    }
    onSubmit(e) {
        console.log(this.props.userEmail)
        axios.post('http://localhost:5000/recruiter/addjob', this.state.jobData)
            .then(res => {
                console.log('success!');
                alert('success');
                window.location.replace('/')
                console.log(this.state.jobData);
            }).catch(err => {
                console.log(err.response);
                if (err) {
                    alert('error in data!')
                    this.setState({ errors: err.response.data });
                    console.log(this.state.errors)
                }
            })
    }

    onChangeSkills(value) {
        console.log(value)
        var tempJob = this.state.jobData;
        var skillList = []
        value.map((ob) => {
            skillList = [...skillList, { lang: ob.value }]
        })
        tempJob['skills'] = skillList;
        this.setState({ jobData: tempJob });
    }

    onChangeDate(e) {
        console.log(e);
        var tempJob = this.state.jobData;
        tempJob['deadline'] = e;
        this.setState({ jobData: tempJob });
    }

    render() {
        return (
            <div>
                <h3>add job</h3>
                <br/>
                <div className='form-group row'>
                    <label className='col-lg-2'>job title</label>
                    <div className='col-lg-7'>
                        <input type='text' required id='title' onChange={this.onChange} />
                        <div className="text-danger">{this.state.errors.title}</div>
                    </div></div>

                <div className='form-group row'>
                    <label className='col-lg-2'>job type</label>
                    <div className='col-lg-7'>
                        <select className="form-control" onChange={this.onChange} id='jobType' >
                            <option value="Full-time" selected>Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Work-from-home">Work from home</option>
                        </select>
                    </div>
                </div>

                <div className='form-group row'>
                    <label className='col-lg-2'>Salary</label>
                    <div className='col-lg-7'>
                        <input type='text' required id='salary' onChange={this.onChange} />
                        <div className="text-danger">{this.state.errors.salary}</div>
                    </div>
                </div>

                <div className='form-group row'>
                    <label className='col-lg-2'>Deadline</label>
                    <div className='col-lg-7'>
                        <DatePicker id='deadline' selected={this.state.date} onChange={this.onChangeDate} minDate={new Date()} value={this.state.jobData['deadline']} />
                    </div>
                    <div className="text-danger">{this.state.errors.deadline}</div>

                </div>

                <div className='form-group row'>
                    <label className='col-lg-2'>max applications</label>
                    <div className='col-lg-7'>
                        <input type='text' required id='maxApplicants' onChange={this.onChange} />
                        <div className="text-danger">{this.state.errors.maxApplicants}</div>
                    </div>
                </div>

                <div className='form-group row'>
                    <label className='col-lg-2'>max positions</label>
                    <div className='col-lg-7'>
                        <input type='text' required id='maxPositions' onChange={this.onChange} />
                        <div className="text-danger">{this.state.errors.maxPositions}</div>
                    </div>
                </div>

                <div className='form-group row'>
                    <label className='col-lg-2'>Duration in months </label>
                    <div className='col-lg-7'>
                        <input type='text' required id='duration' onChange={this.onChange} />
                        <div className="text-danger">{this.state.errors.duration}</div>
                    </div>
                </div>

                {
                    <div className='row'>
                        <label className='col-lg-2'>skills required</label>
                        <div className='col-lg-7'>
                            <Creatable onChange={(value) => this.onChangeSkills(value)}
                                isMulti
                                options={defaultLangs}
                                value={this.state.skills}
                            />
                            <div className="text-danger">{this.state.errors.skills}</div>
                        </div>
                    </div>
                }

                <button className='btn red shadow' onClick={() => { this.onSubmit() }} >add job</button>

                <br />

            </div>
        )
    }
}
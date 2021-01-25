import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';
import Creatable from 'react-select/creatable';
import DatePicker from 'react-date-picker'
import { Row, Col } from 'react-bootstrap'

const defaultLangs = [
    { label: "C", value: "C" }, { label: "C++", value: "C++" }, { label: "python", value: "python" }, { label: "java", value: "java" }
]

export default class RecEditJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            job: {},
            errors: {},
            skillList: [],
        }

        this.onChange = this.onChange.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeSkills = this.onChangeSkills.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        var req = { jobId: this.props.jobId };
        console.log(req)
        axios.post('http://localhost:5000/recruiter/getJobDetails', req).then(res => {
            var skillTemp = []
            res.data.skills.map(skill => {
                skillTemp = [...skillTemp, { label: skill.lang, value: skill.lang }]
            })
            this.setState({ job: res.data, Loading: false });
            this.setState({ skillList: skillTemp })
            console.log(this.state.job.applications.length);
            console.log(this.state.array)
        }).catch(err => {
            if (err['response']) {
                alert(err.response.data)
            }
        })
    }

    onChangeDate(e) {
        console.log(e);
        var tempJob = this.state.job;
        tempJob['deadline'] = e;
        this.setState({ job: tempJob });
    }

    onChangeSkills(value) {
        console.log(value)
        var tempJob = this.state.job;
        var skillList = []
        if (value)
            value.map((ob) => {
                skillList = [...skillList, { lang: ob.value }]
            })
        tempJob['skills'] = skillList;
        this.setState({ job: tempJob });
        this.setState({ skillList: value })
    }

    onChange(e) {
        e.preventDefault();
        // console.log(e.target.id);
        var tempData = this.state.job;
        tempData[e.target.id] = e.target.value;
        this.setState({ job: tempData });
    }

    onDelete(e) {
        console.log('delete');
        axios.post('http://localhost:5000/recruiter/deleteJob', this.state.job).then(res => {
            console.log(res.data);
            alert('succesfully deleted job, and all its applications')
            window.location.replace('/')
        }).catch(e => console.log(e));
    }

    onSubmit(e) {
        console.log(this.props.userEmail)
        axios.post('http://localhost:5000/recruiter/editJob', this.state.job)
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

    render() {
        if (this.state.Loading)
            return (
                <h1>Loading</h1>
            )

        return (
            <div>
                <h1>RecEditJob</h1>
                <div>
                    <h1>add job</h1>
                    <div className='form-group'>
                        <label>job title</label>
                        <input type='text' required id='jobTitle' onChange={this.onChange} value={this.state.job.jobTitle} />
                        <div className="text-danger">{this.state.errors.title}</div>
                    </div>

                    <div className='form-group'>
                        <label>job type</label>
                        <select className="form-control" onChange={this.onChange} id='jobType' value={this.state.job.jobType}>
                            <option value="Full-time" >Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Work-from-home">Work from home</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Salary</label>
                        <input type='text' required id='salary' onChange={this.onChange} value={this.state.job.salary} />
                        <div className="text-danger">{this.state.errors.salary}</div>
                    </div>

                    <div className='form-group'>
                        <label>Deadline</label>
                        <DatePicker id='deadline' selected={this.state.date} onChange={this.onChangeDate} minDate={new Date()} value={this.state.job['deadline']} />
                        <div className="text-danger">{this.state.errors.deadline}</div>

                    </div>

                    <div className='form-group'>
                        <label>max num of applications</label>
                        <input type='text' required id='maxApplicants' onChange={this.onChange} value={this.state.job.maxApplicants} />
                        <div className="text-danger">{this.state.errors.maxApplicants}</div>
                    </div>

                    <div className='form-group'>
                        <label>max num of positions</label>
                        <input type='text' required id='maxPositions' onChange={this.onChange} value={this.state.job.maxPositions} />
                        <div className="text-danger">{this.state.errors.maxPositions}</div>
                    </div>

                    <div className='form-group'>
                        <label>Duration in months </label>
                        <input type='text' required id='duration' onChange={this.onChange} value={this.state.job.duration} />
                        <div className="text-danger">{this.state.errors.duration}</div>
                    </div>

                    {
                        <div>
                            <label>skills required</label>
                            <Creatable value={this.state.skillList} onChange={(value) => this.onChangeSkills(value)}
                                isMulti
                                options={defaultLangs}
                            />
                            <div className="text-danger">{this.state.errors.skills}</div>

                        </div>
                    }
                    <br />
                    <br />
                    <Row>
                        <Col>
                            <button onClick={() => { this.onSubmit() }} >edit</button>
                        </Col>
                        <Col>
                            <button onClick={this.onDelete}>delete</button>
                        </Col>
                    </Row>
                </div>
                {JSON.stringify(this.state.job)} <br />
                {JSON.stringify(this.state.skillList)}
            </div>
        )
    }
}
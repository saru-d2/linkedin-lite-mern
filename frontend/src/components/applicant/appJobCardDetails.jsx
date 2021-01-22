import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment'

export default class AppJobCardDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            job: {},
            recruiterUser: {},
            application: null,
            SOP: '',
            errors: {},
        }

        this.onChangeSOP = this.onChangeSOP.bind(this);
        this.onApply = this.onApply.bind(this);
    }

    componentDidMount() {
        var req = { jobId: this.props.jobId };
        console.log(req);


        axios.post('http://localhost:5000/applicant/getJobDetails', req)
            .then(res => {
                console.log(res);
                this.setState({ job: res.data });
                console.log(this.state.job)
                var req2 = { recId: this.state.job.recruiter };
                axios.post('http://localhost:5000/applicant/getRecruiterUser', req2)
                    .then(res => {
                        console.log(res.data)
                        this.setState({
                            recruiterUser: res.data,
                        })
                        console.log(res.data)
                    }).catch(err => {
                        this.setState({
                            errors: err
                        });
                        console.log(err);
                    })
            }).catch(err => console.log(err));
    }

    onApply(e) {
        //apply
        var req = { job: this.state.job, email: this.props.userEmail, SOP: this.state.SOP };
        console.log(req);

        if (this.state.SOP == '') {
            alert('SOP cant be null');
            return;
        }

        axios.post('http://localhost:5000/applicant/applyForJob', req)
            .then(res => {
                console.log(res.data)
                alert('successfully applied!')
                window.location.replace('http://localhost:3000/');
            })
            .catch(err => {
                console.log(err);
                if (err['response'])
                    alert(err.response.data.msg);
                else alert(err);
            })
    }

    onChangeSOP(e) {
        // e.preventDefault();
        this.setState({ SOP: e.target.value })
    }

    render() {
        return (
            <div>
                <h1>appjobcarddetails</h1>
                <h5>title: {this.state.job.jobTitle}</h5>
                <p>
                    jobType: {this.state.job.jobType} <br />
                    salary: {this.state.job.salary} <br />
                    maxApplicants: {this.state.job.maxApplicants} <br />
                    maxPositions: {this.state.job.maxPositions} <br />
                    duration: {this.state.job.duration} months <br />
                    deadline: <Moment format="YYYY/MM/DD">{this.state.job.deadline}</Moment> <br />
                    recruiter name: {this.state.recruiterUser.name}<br />
                    recruiter email: {this.state.recruiterUser.email}
                </p>

                <div className='form-group'>
                    <label>SOP</label>
                    <input type='text' required id='SOP' onChange={this.onChangeSOP} />
                    <div className="text-danger">{this.state.errors.SOP}</div>
                </div>
                <button onClick={this.onApply}>Apply!</button>
                {JSON.stringify(this.state.job)}
                {JSON.stringify(this.state.recruiterUser)}
            </div>
        )
    }
}
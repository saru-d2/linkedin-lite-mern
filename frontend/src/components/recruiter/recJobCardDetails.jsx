import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';



export default class RecJobCardDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Loading: true,
            job: {},
            recruiter: {},
        }
    }

    componentDidMount() {
        var req = { jobId: this.props.jobId }
        axios.post('http://localhost:5000/recruiter/getJobDetails', req).then(res => {
            this.setState({ job: res.data, Loading: false });
            console.log(this.state.job.applications.length);
            console.log(this.state.array)
        }).catch(err => {
            if (err['response']) {
                alert(err.response.data)
            }
        })
    }

    render() {

        if (this.state.Loading) return (<h1> LOADING</h1>)
        return (
            <div>
                <h1>jobcardeets</h1>
                {this.props.jobId}
                <div className='card-body'>
                    <h5>title: {this.state.job.jobTitle}</h5>
                    <p>
                        jobType: {this.state.job.jobType} <br />
                        salary: {this.state.job.salary} <br />
                        numApplications: {this.state.job.numApplicants} <br />
                        maxApplicants: {this.state.job.maxApplicants} <br />
                        maxPositions: {this.state.job.maxPositions} <br />
                        duration: {this.state.job.duration} months <br />
                        deadline: <Moment format="YYYY/MM/DD">{this.state.job.deadline}</Moment>
                        </p>
                        <br />
                        <br />
                        <Row>
                            <Col>
                                <Link to={{
                                    pathname: '/recSeeJobApps',
                                    state: {
                                        jobId: this.state.job._id
                                    }
                                }} >see applications</Link></Col>
                            <Col>
                                <Link to={{
                                    pathname: '/recEditJob',
                                    state: {
                                        jobId: this.state.job._id
                                    }
                                }} >Edit job</Link>
                            </Col>
                        </Row>
                        <br />
                        <br />
                        {JSON.stringify(this.state.job)}<br />
                        {typeof (this.state.job.applications)}
                </div>
            </div >
        )
    }
}
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';

export default class AppJobCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recruiterUser: {},
            errors: {}
        }
    }

    componentDidMount() {
        console.log('hi')
        const req = { recId: this.props.job.recruiter };
        axios.post('http://localhost:5000/applicant/getRecruiterUser', req).then(res => {
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
    }

    onClick(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <div className='card-body row'>
                    <div className='col'>
                        <h5>title: {this.props.job.jobTitle}</h5>
                        <p>
                            jobType: {this.props.job.jobType} <br />
                        salary: {this.props.job.salary} <br />

                        </p>
                    </div>
                    <div className='col'>
                        <Link
                            to={{
                                pathname: '/appJobCardDetails',
                                state: {
                                    jobId: this.props.job._id
                                }
                            }} >see more and apply!</Link>
                    </div>
                </div>
            </div>
        )
    }
}
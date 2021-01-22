import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';

export default class RecJobCard extends Component {
    render() {
        return (
            <div>
                <div className='card-body row'>
                    <div className='col'>
                        <h5>title: {this.props.job.jobTitle}</h5>
                        <p>
                            jobType: {this.props.job.jobType} <br />
                        salary: {this.props.job.salary} <br />
                        numApplications: {JSON.stringify(this.props.job.applications)} <br />
                        deadline: <Moment format="YYYY/MM/DD">{this.props.job.deadline}</Moment> <br />
                        </p>
                    </div>
                    <div className='col'>
                        <Link
                            to={{
                                pathname: '/recJobCardDetails',
                                state: {
                                    jobId: this.props.job._id
                                }
                            }} >see details</Link>
                    </div>
                </div>
            </div>
        )
    }
}
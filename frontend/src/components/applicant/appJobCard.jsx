import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';

export default class AppJobCard extends Component {
    
    render() {
        return (
            <div>
                <div className='card-body'>
                    <h5>title: {this.props.job.jobTitle}</h5>
                    <p>
                        jobType: {this.props.job.jobType} <br />
                        salary: {this.props.job.salary} <br />
                        maxApplicants: {this.props.job.maxApplicants} <br />
                        maxPositions: {this.props.job.maxPositions} <br />
                        duration: {this.props.job.duration} months <br />
                        deadline: <Moment format="YYYY/MM/DD">{this.props.job.deadline}</Moment> <br />
                    </p>
                </div>
            </div>
        )
    }
}
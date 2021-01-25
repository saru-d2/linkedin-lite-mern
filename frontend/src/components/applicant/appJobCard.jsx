import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';

export default class AppJobCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recruiter: {},
            errors: {},
            Loading: true
        }
    }

    componentDidMount() {
        console.log('hi')
        const req = { recId: this.props.job.recruiter };
        axios.post('http://localhost:5000/applicant/getRecruiterUser', req).then(res => {
            console.log(res.data)
            this.setState({
                recruiter: res.data,
                Loading: false
            })
            console.log(res.data)
        }).catch(err => {
            this.setState({
                errors: err
            });
            console.log(err);
        })

        if (this.props.job.numRated == 0) this.props.job.rating = 0;
        else this.props.job.rating = this.props.job.totalRating / this.props.job.numRated;
    }

    onClick(e) {
        e.preventDefault();
    }

    render() {
        if (this.state.Loading) return (<h1>loading</h1>)

        var link = <Link
            to={{
                pathname: '/appJobCardDetails',
                state: {
                    jobId: this.props.job._id
                }
            }} >see more and apply!</Link>

        if (this.props.isAccepted) link = <button style={{ backgroundColor:'red' }}> you already have a job
        </button>


        return (
            <div>
                <div className='card-body row'>
                    <div className='col'>
                        <h5>title: {this.props.job.jobTitle}</h5>
                        <p>
                            jobType: {this.props.job.jobType} <br />
                        salary: {this.props.job.salary} <br />
                        recruiter: {this.state.recruiter.user.name} <br />
                        rating: {this.props.job.rating}
                        </p>
                    </div>
                    <div className='col'>
                        {link}
                    </div>
                </div>
                {JSON.stringify(this.props.job)}
                {JSON.stringify(this.props.isAccepted)}
            </div>
        )
    }
}
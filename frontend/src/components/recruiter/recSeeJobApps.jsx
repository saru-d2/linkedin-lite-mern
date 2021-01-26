import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import ApplicationCard from './ApplicationCard'

export default class recSeeJobApps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationList: null,
            Loading: true,
        }

        this.onSortRating = this.onSortRating.bind(this);
        this.onSortName = this.onSortName.bind(this);
        this.onSortDate = this.onSortDate.bind(this);
    }

    componentDidMount() {
        var req = { jobId: this.props.jobId };
        axios.post('http://localhost:5000/recruiter/getAppsForjobs', req)
            .then(res => {
                console.log(res);
                this.setState({ applicationList: res.data, Loading: false })
            })
            .catch(err => {
                if (err['response']) alert(err.response.data.msg)
            })
    }

    onSortRating(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const apps = this.state.applicationList;
        apps.sort(function (a, b) {
            var aRat = 0
            var bRat = 0
            if (!a.applicant['totalRating']) a.applicant['totalRating'] = 0;
            if (!b.applicant['totalRating']) b.applicant['totalRating'] = 0;
            if (a.applicant['numRated'] > 0) aRat = a.applicant['totalRating'] / a.applicant['numRated']
            if (b.applicant['numRated'] > 0) bRat = b.applicant['totalRating'] / b.applicant['numRated']

            return (e.target.getAttribute('polarity')) * (aRat - bRat)
        })
        this.setState({ applicationList: apps })
    }

    onSortName(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const apps = this.state.applicationList;

        apps.sort(function (a, b) {
            console.log(a.applicant.user.name)
            console.log(b.applicant.user.name)
            if (e.target.getAttribute('polarity') == 1)
                return a.applicant.user.name.localeCompare(b.applicant.user.name)
            else
                return b.applicant.user.name.localeCompare(a.applicant.user.name)
        })
        this.setState({ applicationList: apps })
    }

    onSortDate(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const apps = this.state.applicationList;

        apps.sort(function (a, b) {
            console.log(a.date)
            console.log(b.date)
            if (e.target.getAttribute('polarity') == 1)
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            else
                return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        this.setState({ applicationList: apps })
    }

    render() {
        if (this.state.Loading) return (<h1>loading</h1>)

        console.log(this.state.applicationList)
        if (this.state.applicationList.length !== 0)
            var applicationCards = this.state.applicationList.map(application =>
                <div className='card shadow-move-cyan'>
                    <ApplicationCard application={application} />
                </div>
            )
        else {
            var applicationCards = <h1>No applications yet</h1>
        }

        return (
            < div >
                <h1>recSeeJobApps</h1>
                <div className='row'>

                    <div className='col'>
                        <div className='row'>
                            <button id='name'  className='btn shadow-move-cyan' polarity={1} onClick={this.onSortName}>sort-by-name asc</button>
                        </div>
                        <div className='row'>
                            <button id='salary'  className='btn shadow-move-cyan' polarity={-1} onClick={this.onSortName}>sort-by-name desc
                            </button>
                        </div>
                    </div>

                    <div className='col'>
                        <div className='row'>
                            <button id='rating'  className='btn shadow-move-cyan' polarity={1} onClick={this.onSortRating} >sort-by-rating asc</button>
                        </div>
                        <div className='row'>
                            <button id='rating'  className='btn shadow-move-cyan' polarity={-1} onClick={this.onSortRating} >sort-by-rating desc
                                </button>
                        </div>
                    </div>

                    <div className='col'>
                        <div className='row'>
                            <button id='date'  className='btn shadow-move-cyan' polarity={1} onClick={this.onSortDate}> sort-by-date asc</button>
                        </div>
                        <div className='row'>
                            <button id='date' className='btn shadow-move-cyan' polarity={-1} onClick={this.onSortDate}>sort-by-date desc
                            </button>
                        </div>
                    </div>
                </div>
                <br/>
                <br/>

                {applicationCards}
                {/* {JSON.stringify(this.state.applicationList)} */}
            </div >
        )
    }
}
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';

export default class RecAppCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: null,
        }

        this.onRate = this.onRate.bind(this)
        this.onChangeRating = this.onChangeRating.bind(this);
    }

    onRate() {
        if (!this.state.rating || this.state.rating > 5 || this.state.rating < 1) { alert('check the value of rating'); return; }
        var req = { application: this.props.application, rating: this.state.rating }
        console.log(req);
        axios.post('http://localhost:5000/recruiter/rateApplicant', req).then(res => {
            console.log(res);
            alert('done!');
            this.setState({ rating: req.rating });
            window.location.reload(false);
        }).catch(err => {
            console.log(err);
        })
    }

    onChangeRating(e) {
        e.preventDefault();
        this.setState({ rating: e.target.value });
    }

    render() {
        // if (this.state.Loading2 || this.state.Loading2) return (<h1>LOADING</h1>)

        var eduList = this.props.application.applicant.education.map(edu =>
            <div className='row'>
                <div className='col'>{edu.instiName}</div>
                <div className='col'>{edu.startYear}</div>
                <div className='col'>{edu.endYear}</div>
                <br />
            </div>
        )

        var rating = 0
        if (this.props.application.applicant.numRated > 0) rating = this.props.application.applicant.totalRating / this.props.application.applicant.numRated

        var skillStr = ''
        for (var i = 0; i < this.props.application.applicant.skills.length; i++) {
            skillStr += ' ' + this.props.application.applicant.skills[i].lang + ' '
        }

        var RateButton = <button style={{ backgroundColor: 'red' }}> already Rated </button>
        if (!this.props.application.appRated) {
            console.log('not rated')
            RateButton = <div>
                <input type='number' min='1' max='5' onChange={this.onChangeRating} />
                <button value={this.state.rating} onClick={this.onRate} style={{ backgroundColor: 'green' }} onChange={this.onChangeRating}> rate! </button>
            </div>
        }
        return (
            <div style={{ 'marginLeft': '5%', }}>
                <div className='row' >
                    job: {this.props.application.job.jobTitle} <br />
                    applicant name: {this.props.application.applicant.user.name}<br />
                applicant email: {this.props.application.applicant.user.email} <br />
                rating: {rating} <br />

                application status: {this.props.application.status}
                </div>
                education:
                <div className='row'>
                    <div className='col'>institute</div>
                    <div className='col'>start year</div>
                    <div className='col'>end year</div>
                </div>
                {eduList}
                <br />
                <div className='row' style={{ 'marginLeft': '0.5%', }}>
                    skills:
                    {skillStr}
                </div >
                date of joining: {this.props.application.accDate}

                <br />
                {RateButton} <br />
                {JSON.stringify(this.state.rating)}

                {JSON.stringify(this.props.application)}
            </div>
        )
    }
}
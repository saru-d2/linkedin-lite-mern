import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import emailjs from 'emailjs-com';

export default class ApplicationCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Loading1: true,
            Loading2: true,
            job: {},
        }

        this.onAccept = this.onAccept.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onShortlist = this.onShortlist.bind(this);
    }

    componentDidMount() {

        var req = { jobId: this.props.application.job }
        axios.post('http://localhost:5000/recruiter/getJobDetails', req).then(res => {
            this.setState({
                job: res.data,
                Loading2: false,
            })
        })
        axios.post()
    }

    onReject(e) {
        e.preventDefault();
        var req = { applicationId: this.props.application._id }
        axios.post('http://localhost:5000/recruiter/rejectApplicant', req)
            .then(res => {
                alert('rejected');
                window.location.reload();
            })
            .catch(err => {
                if (err['response']['data']) {
                    console.log(err.response.data);
                } else {
                    console.log('error')
                }
                alert('error');
            })
        console.log('reject')
    }
    onAccept(e) {
        e.preventDefault();
        var req = { applicationId: this.props.application._id };

        var mailDeets = { to_email: this.props.application.applicant.user.email, job: this.state.job.jobTitle, to_name: this.props.application.applicant.user.name, from_name: this.state.job.recruiter.user.name }

        console.log(mailDeets)

        axios.post('http://localhost:5000/recruiter/acceptApplicant', req)
            .then(res => {
                // to send email
                emailjs.send('ssad.2019101016', 'ssad.template', mailDeets, 'user_1bOBkzRuF9QtdqoZQxHNE')
                    .then((response) => {
                        console.log('SUCCESS!', response.status, response.text);
                        alert('accepted');
                        window.location.reload();
                    }, (err) => {
                        console.log('FAILED...', err);
                    });

            })
            .catch(err => {
                if (err['response']['data']) {
                    console.log(err.response.data);
                } else {
                    console.log('error')
                }
                alert('error');
            })
        console.log('accept')
    }

    onShortlist(e) {
        e.preventDefault();
        var req = { applicationId: this.props.application._id }
        axios.post('http://localhost:5000/recruiter/shortlistApplicant', req)
            .then(res => {
                alert('shortlisted');
                window.location.reload();
            })
            .catch(err => {
                if (err['response']['data']) {
                    console.log(err.response.data);
                } else {
                    console.log('error')
                }
                alert('error');
            })
        console.log('shortlist')
    }

    render() {
        if (this.state.Loading2 || this.state.Loading2) return (<h1>LOADING</h1>)

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

        var buttons = null;
        if (this.props.application.status === 'accepted')
            buttons = <div>
                <button style={{ backgroundColor: "green" }}> already acepted</button>
            </div>
        else if (this.state.job.numAccepted >= this.state.job.maxPositions) buttons = <div>
            <button style={{ backgroundColor: "red" }}>full</button>
        </div>
        else if (this.props.application.status === 'applied') buttons = <div>
            <div className='row'>
                <div className='col'>
                    <button className='btn cyan shadow-move-cyan' onClick={this.onShortlist}>shortlist</button>
                </div>
                <div className='col'>
                    <button className='btn red shadow-move-cyan' onClick={this.onReject}>reject</button>
                </div>
            </div>
        </div>

        else if (this.props.application.status === 'shortlisted') buttons = <div>
            <div className='row'>
                <div className='col'>
                    <button className='btn green shadow-move-cyan' onClick={this.onAccept}>accept</button>
                </div>
                <div className='col'>
                    <button className='btn red shadow-move-cyan' onClick={this.onReject}>reject</button>
                </div>
            </div>
        </div>

        var img = 'no image';
        if (this.props.application.applicant)
            if (this.props.application.applicant.img)
                img = <img src={this.props.application.applicant.img} className="mx-2 card-pic" width="100%" height='100%' />

        return (
            <div style={{ 'marginLeft': '5%', }}>
                <div className='row mx-2'>
                    <div className='col'>
                    applicant name: {this.props.application.applicant.user.name}<br />
                    applicant email: {this.props.application.applicant.user.email} <br />
                    rating: {rating} <br />
                    application status: {this.props.application.status}
                    </div>
                    <div className='col'>
                        {img}
                    </div>
                </div>
                education:
                <div className='row'>
                    <div className='col'>institute</div>
                    <div className='col'>start year</div>
                    <div className='col'>end year</div>
                </div>
                {eduList}
                <br />
                <div className='row pull-left' style={{  alignSelf: 'left' }}>
                    <div className='col-lg-1'>
                        skills:
                    </div>
                    <div className='col-lg-10'>
                        {skillStr}
                    </div>
                </div >
                date: {this.props.application.date}

                <br />
                <br />
                sop: {this.props.application.SOP}
                <br/>
                <br/>
                {buttons}
                <br/>
                <br/>

                {/* 
                {JSON.stringify(this.state.job)}
                {JSON.stringify(this.props.application.applicant.img)} */}
            </div>
        )
    }
}
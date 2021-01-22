import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';

export default class ApplicationCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            applicant: {},
            Loading: true,
        }

        this.onAccept = this.onAccept.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onShortlist = this.onShortlist.bind(this);
    }

    componentDidMount() {
        var req = { applicantId: this.props.application.applicant }
        axios.post('http://localhost:5000/recruiter/getApplicantFromId', req).then(res => {
            console.log(res.data);
            this.setState({
                applicant: res.data,
            })
            req = { userId: this.state.applicant.user }
            axios.post('http://localhost:5000/recruiter/getUserFromId', req).then(res => {
                this.setState({
                    user: res.data,
                    Loading: false,
                })
            }).catch(err => console.log(err.response))
            console.log(res.data);
        }).catch(err => console.log(err.response))
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
        var req = { applicationId: this.props.application._id }
        axios.post('http://localhost:5000/recruiter/acceptApplicant', req)
            .then(res => {
                alert('accepted');
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
        if (this.state.Loading) return (<h1>LOADING</h1>)

        var eduList = this.state.applicant.education.map(edu =>
            <div className='row'>
                <div className='col'>{edu.instiName}</div>
                <div className='col'>{edu.startYear}</div>
                <div className='col'>{edu.endYear}</div>
                <br />
            </div>
        )

        var skillStr = ''
        for (var i = 0; i < this.state.applicant.skills.length; i++) {
            skillStr += ' ' + this.state.applicant.skills[i].lang + ' '
        }

        var buttons = null;
        if (this.props.application.status === 'applied') buttons = <div>
            <div className='row'>
                <div className='col'>
                    <button onClick={this.onShortlist}>shortlist</button>
                </div>
                <div className='col'>
                    <button onClick={this.onReject}>reject</button>
                </div>
            </div>
        </div>

        else if (this.props.application.status === 'shortlisted') buttons = <div>
            <div className='row'>
                <div className='col'>
                    <button onClick={this.onAccept}>accept</button>
                </div>
                <div className='col'>
                    <button onClick={this.onReject}>reject</button>
                </div>
            </div>
        </div>

        return (
            <div style={{ 'marginLeft': '5%', }}>
                <div className='row' >
                    applicant name: {this.state.user.name}<br />
                applicant email: {this.state.user.email} <br />
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
                <br />
                {buttons}

            </div>
        )
    }
}
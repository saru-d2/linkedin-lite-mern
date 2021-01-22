import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Moment from 'react-moment';
import axios from 'axios';
import ApplicationCard from './ApplicationCard'

export default class recSeeJobApps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationList: null,
            Loading: true,
        }
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

    render() {
        if (this.state.Loading) return (<h1>loading</h1>)

        console.log(this.state.applicationList)
        var applicationCards = this.state.applicationList.map(application => 
            <div className='card'>
                <ApplicationCard application={application} />
            </div>
            )

        return (
            < div >
                <h1>recSeeJobApps</h1>
                {applicationCards}
                {JSON.stringify(this.state.applicationList)}
            </div >
        )
    }
}
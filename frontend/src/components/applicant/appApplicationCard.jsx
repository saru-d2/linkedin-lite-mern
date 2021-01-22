import axios from "axios";
import React, { Component } from "react";

export default class AppApplicationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job: {},
            Loading: true,
        }

    }

    componentDidMount() {
        var req = { jobId: this.props.application.job }
        console.log(req);
        axios.post('http://localhost:5000/applicant/getJobFromApplication', req)
            .then(res => {
                this.setState({
                    job: res.data,
                    Loading: false,
                })
            }).catch(err => {
                console.log(err);
            })
    }

    render() {
        if (this.state.Loading) return (<h1>...Loading...</h1>);
        return (
            <div>
                job title: {this.state.job.jobTitle} <br />
                status: {this.props.application.status} <br />
            </div>
        )
    }
}
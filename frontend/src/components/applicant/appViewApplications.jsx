import axios from "axios";
import React, { Component } from "react"
import AppApplicationCard from './appApplicationCard'

export default class AppViewApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userEmail,
            applications: {},
            Loading: true,
        }
    }

    componentDidMount() {
        var req = { userEmail: this.state.email };
        axios.post('http://localhost:5000/applicant/listApplications', req)
            .then(res => {
                console.log(res.data);
                this.setState({ applications: res.data, Loading: false });
            })
            .catch(err => console.log(err.response))
    }

    render() {
        if (this.state.Loading)
            return (<div><h1>...Loading...</h1></div>)

        var applicationList = this.state.applications.map(application =>
            <div className='card'>
                <AppApplicationCard application={application}/>
            </div>
        )


        return (
            <div>
                <h1>appViewApplications</h1>
                {applicationList}
            </div>
        )
    }
}
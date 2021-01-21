import React, { Component } from 'react';
import axios from 'axios';
import AppJobCard from './appJobCard'


export default class AppViewJobs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userEmail,
            jobList: [],
            Loading: true
        }
    }


    componentDidMount() {
        const data = { email: this.state.email }
        axios.post('http://localhost:5000/applicant/viewjobs')
            .then((res) => {
                console.log(`${res.data}`);
                this.setState({
                    jobList: res.data,
                    Loading: false
                });
            }).catch(err => console.log(err.response))
    }

    render() {
        if (this.state.Loading)
            return (<h1>...Loading..</h1>);

        console.log(this.state.jobList)
        var jobCards = this.state.jobList.map((job) =>
            <React.Fragment>
                <div className='card'>
                    <AppJobCard job={job}  />
                </div>
                <br />
            </React.Fragment>
        );
        console.log();

        return (
            // {jobCards}
            <div>
                <h1>wow</h1>
                {jobCards}
            </div>
        )
    }
}
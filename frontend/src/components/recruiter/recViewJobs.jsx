import React, { Component } from 'react';
import axios from 'axios';

import RecJobCard from './recJobCard';

export default class RecViewJobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userEmail,
            Loading: true,
            jobList: [],
            errors: null,
        }
        this.onClickCard = this.onClickCard.bind(this);
    }

    componentDidMount() {
        const data = { email: this.state.email };
        axios.post('http://localhost:5000/recruiter/listJobs', data)
            .then((response) => {
                console.log(`${response.data}`);
                this.setState({
                    jobList: response.data,
                    Loading: false,
                })
            }).catch(err => console.log(err.response))

    }

    onClickCard(e) {
        e.preventDefault();
        console.log('clicked');
    }

    render() {

        if (this.state.Loading) {
            return (
                <h1>..Loading..</h1>
            )
        }

        // jobCards = null;
        console.log(this.state.jobList)
        var jobCards = this.state.jobList.map((job) =>
        <div className='card'>
            <RecJobCard job={job} onClick={this.onClickCard} />
        </div>
        )
        //if no filters

        console.log(jobCards)
        return (
            <div>
                <h1>helllllooooo</h1>
                {jobCards}
                <h1> ooga</h1>
                {JSON.stringify(this.state.jobList)}

            </div>
        )

    }
}
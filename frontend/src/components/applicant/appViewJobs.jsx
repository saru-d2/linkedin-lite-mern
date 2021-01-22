import React, { Component } from 'react';
import axios from 'axios';
import AppJobCard from './appJobCard'


export default class AppViewJobs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userEmail,
            jobList: [],
            Loading: true,
            search: null,
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

    onChangeSearch(e) { 
        e.preventDefault();
        this.setState({search: e.target.value})
    }

    onSubmitSearch(e) {
        e.preventDefault();
        var req = {search: this.state.search};
        
    }

    render() {
        if (this.state.Loading)
            return (<h1>...Loading..</h1>);

        console.log(this.state.jobList)
        var jobCards = this.state.jobList.map((job) =>
            <React.Fragment>
                <div className='card'>
                    <AppJobCard job={job} />
                </div>
                <br />
            </React.Fragment>
        );
        console.log();

        return (
            // {jobCards}
            <div>
                <div className='row'>
                    <div className='col'>
                        <input className="form-control" onChange={this.onChangeSearch} placeholder="Search" id="search" type="text" />
                    </div>
                    <div className='col'>
                        <button onClick={this.o}></button>
                    </div>
                </div>
                <h1>wow</h1>
                {jobCards}
            </div>
        )
    }
}
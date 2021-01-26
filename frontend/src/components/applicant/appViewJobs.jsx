import React, { Component } from 'react';
import axios from 'axios';
import AppJobCard from './appJobCard'
import { Col, Row } from 'react-bootstrap';


export default class AppViewJobs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userEmail,
            jobList: [],
            Loading1: true,
            Loading2: true,
            search: '',
            filter: {
                jobType: 'select',
                minSalary: -1,
                maxSalary: 1000000000,
                maxDuration: 7,
            },
            isAccepted: {}
        }
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onSortRating = this.onSortRating.bind(this);
        this.onSortRating = this.onSortRating.bind(this);
        this.onSortSalary = this.onSortSalary.bind(this);
    }


    componentDidMount() {
        axios.post('http://localhost:5000/applicant/viewjobs')
            .then((res) => {
                console.log(`${res.data}`);
                this.setState({
                    jobList: res.data,
                    Loading1: false
                });
            }).catch(err => console.log(err.response))
        axios.post('http://localhost:5000/applicant/getAcceptedApp').then(res => {
            this.setState({
                isAccepted: res.data,
                Loading2: false
            })
        }).catch(e => {
            console.log(e);
            alert(e);
        })
    }

    onChangeFilter(e) {

        var tempFil = this.state.filter
        tempFil[e.target.id] = e.target.value;
        this.setState({
            filter: tempFil
        });
    }

    onChangeSearch(e) {
        e.preventDefault();
        this.setState({ search: e.target.value })
    }

    onSubmitSearch(e) {
        e.preventDefault();
        var req = { search: this.state.search };
        axios.post('http://localhost:5000/applicant/viewjobs', req)
            .then((res) => {
                console.log(`${res.data}`);
                this.setState({
                    jobList: res.data,
                    Loading: false
                });
            }).catch(err => console.log(err.response))

    }



    onSortRating(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const jobs = this.state.jobList;
        jobs.sort(function (a, b) {
            var aRat = 0
            var bRat = 0
            if (!a['totalRating']) a['totalRating'] = 0;
            if (!b['totalRating']) b['totalRating'] = 0;
            if (a['numRated'] > 0) aRat = a['totalRating'] / a['numRated']
            if (b['numRated'] > 0) bRat = b['totalRating'] / b['numRated']

            return (e.target.getAttribute('polarity')) * (aRat - bRat)
        })
        this.setState({ jobList: jobs })
    }

    onSortSalary(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const jobs = this.state.jobList;
        jobs.sort(function (a, b) {
            return e.target.getAttribute('polarity') * (a['salary'] - b['salary'])
        })
        this.setState({ jobList: jobs })
    }

    render() {


        if (this.state.Loading1 || this.state.Loading2)
            return (<h1>...Loading..</h1>);

        console.log(this.state.jobList)

        var filterJobs = data => {
            //put some bs here pls
            if (data['salary'] < this.state.filter.minSalary || data['salary'] > this.state.filter.salary) return false;
            if (data['duration'] >= this.state.filter.maxDuration) return false;
            if (this.state.filter.jobType != 'select' && data['jobType'] != this.state.filter.jobType) return false;

            return true;
        }

        var jobCards = this.state.jobList.filter(data => (data['salary'] >= this.state.filter.minSalary && data['salary'] <= this.state.filter.maxSalary) && data['duration'] < this.state.filter.maxDuration && ((this.state.filter.jobType != 'select' && data['jobType'] == this.state.filter.jobType) || (this.state.filter.jobType == 'select'))).map((job) =>
            <React.Fragment>
                <div className='card'>
                    <AppJobCard job={job} isAccepted={this.state.isAccepted} />
                </div>
                <br />
            </React.Fragment>
        );
        console.log();

        return (
            <div>
                <div className='row searchrow '>
                    <div className='col-lg-4'>
                        <input className="form-control" onChange={this.onChangeSearch} placeholder="Search" id="search" type="text" style={{ width: '100%' }} />
                    </div>
                    <div className='col-lg-2'>
                        <button className='btn w-100 h-100 cyan' onClick={this.onSubmitSearch}>search!</button>
                    </div>
                    <div className='col-lg-3'>
                        <div className='row'>
                            <button id='salary' className='btn btn1 cyan' style={{}} polarity={1} onClick={this.onSortSalary}>sort-by-salary asc</button>
                        </div>
                        <div className='row'>
                            <button id='salary' className='btn red' style={{}} polarity={-1} onClick={this.onSortSalary}> sort-by-salary desc
                            </button>
                        </div>
                    </div>

                    <div className='col-lg-3'>
                        <div className='row'>
                            <button id='rating' className='btn cyan' polarity={1} onClick={this.onSortRating} >sort-by-rating asc</button>
                        </div>
                        <div className='row'>
                            <button id='rating' className='btn red' polarity={-1} onClick={this.onSortRating} >sort-by-rating desc
                                </button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-1'>
                        filters:
                    </div>

                    <div className='col-lg-2'>
                        job type:
                    </div>
                    <div className='col-lg-2'>
                        <select className="form-control" onChange={this.onChangeFilter} id='jobType' >
                            <option value="select" selected>select
                            </option>
                            <option value="Full-time" >Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Work-from-home">Work from home</option>
                        </select>
                    </div>
                    <div className='col-lg-2'>
                        salary range:
                    </div>

                    <div className='col-lg-2'>
                        <div className='row'>
                            <input type='number' id='minSalary' value={this.state.filter.minSalary} style={{ width: '100%' }} onChange={this.onChangeFilter} />
                        </div>
                        <div className='row'>
                            <input type='number' id='maxSalary' value={this.state.filter.maxSalary} style={{ width: '100%' }} onChange={this.onChangeFilter} />
                        </div>
                    </div>
                    <div className='col-lg-2'>
                        max Duration:
                    </div>
                    <div className='col-lg-1'>
                        <input type='number' id='maxDuration' value={this.state.filter.maxDuration} style={{ width: '100%' }} onChange={this.onChangeFilter} />
                </div>
            </div>
        <h1>wow</h1>
        { jobCards }
            </div >
        )
    }
}
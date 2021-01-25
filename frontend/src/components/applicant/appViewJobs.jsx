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
            Loading: true,
            search: '',
            filter: {
                jobType: 'select',
                minSalary: -1,
                maxSalary: 1000000000,
                maxDuration: 7,
            }
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
                    Loading: false
                });
            }).catch(err => console.log(err.response))

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


        if (this.state.Loading)
            return (<h1>...Loading..</h1>);

        console.log(this.state.jobList)

        var filterJobs = data => {
            //put some bs here pls
            if (data['salary'] < this.state.filter.minSalary || data['salary'] > this.state.filter.salary) return false;
            if (data['duration'] >= this.state.filter.maxDuration) return false;
            if (this.state.filter.jobType != 'select' && data['jobType'] != this.state.filter.jobType) return false;

            return true;
        }

        var jobCards = this.state.jobList.filter(data => (data['salary'] >= this.state.filter.minSalary && data['salary'] <= this.state.filter.maxSalary) && data['duration'] < this.state.filter.maxDuration && ((this.state.filter.jobType != 'select' && data['jobType'] == this.state.filter.jobType)  || (this.state.filter.jobType == 'select'))).map((job) =>
            <React.Fragment>
                <div className='card'>
                    <AppJobCard job={job} />
                </div>
                <br />
            </React.Fragment>
        );
        console.log();

        return (
            <div>
                <Row>
                    <Col lg={6}>
                        <input className="form-control" onChange={this.onChangeSearch} placeholder="Search" id="search" type="text" style={{ width: '100%' }} />
                    </Col>
                    <Col lg={1}>
                        <button onClick={this.onSubmitSearch}>search!</button>
                    </Col>
                    <Col lg={1.5}>
                        sort-by-salary
                    </Col>
                    <Col lg={1}>
                        <Row>
                            <button id='salary' polarity={1} onClick={this.onSortSalary}>asc</button>
                        </Row>
                        <Row>
                            <button id='salary' polarity={-1} onClick={this.onSortSalary}>desc
                            </button>
                        </Row>
                    </Col>
                    <Col lg={1.5}>
                        sort-by-rating
                    </Col>
                    <Col lg={1}>
                        <Row>
                            <button id='rating' polarity={1} onClick={this.onSortRating} >asc</button>
                        </Row>
                        <Row>
                            <button id='rating' polarity={-1} onClick={this.onSortRating} >desc
                                </button>
                        </Row>
                    </Col>
                </Row>
                <Row>

                    <Col lg={1}>
                        filters:
                    </Col>

                    <Col lg={1}>
                        job type:
                    </Col>
                    <Col lg={3}>
                        <select className="form-control" onChange={this.onChangeFilter} id='jobType' >
                            <option value="select" selected>select
                            </option>
                            <option value="Full-time" >Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Work-from-home">Work from home</option>
                        </select>
                    </Col>
                    <Col lg={1}>
                        salary range:
                    </Col>
                    <Col lg={1}>
                        <Row>
                            <input type='number' id='minSalary' value={this.state.filter.minSalary} style={{ width: '100%' }} onChange={this.onChangeFilter} />
                        </Row>
                        <Row>
                            <input type='number' id='maxSalary' value={this.state.filter.maxSalary} style={{ width: '100%' }} onChange={this.onChangeFilter} />
                        </Row>
                    </Col>
                    <Col lg={1.5}>
                        max Duration:
                    </Col>
                    <Col lg={1}>
                        <input type='number' id='maxDuration' value={this.state.filter.maxDuration} style={{ width: '100%' }} onChange={this.onChangeFilter} />
                    </Col>
                </Row>
                {JSON.stringify(this.state.filter)}
                <h1>wow</h1>
                {jobCards}
            </div>
        )
    }
}
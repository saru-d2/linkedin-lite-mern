import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import RecAppCard from './RecAppCard'

export default class recViewAcc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            applicationList: null,
        }
        this.onSortRating = this.onSortRating.bind(this);
        this.onSortName = this.onSortName.bind(this);
        this.onSortDate = this.onSortDate.bind(this);
    }

    componentDidMount() {
        axios.post('http://localhost:5000/recruiter/getAccForRec')
            .then(res => {
                this.setState({
                    applicationList: res.data,
                    Loading: false
                });

            }).catch(err => { console.log(err) })
    }

    onSortRating(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const apps = this.state.applicationList;
        apps.sort(function (a, b) {
            var aRat = 0
            var bRat = 0
            if (!a.applicant['totalRating']) a.applicant['totalRating'] = 0;
            if (!b.applicant['totalRating']) b.applicant['totalRating'] = 0;
            if (a.applicant['numRated'] > 0) aRat = a.applicant['totalRating'] / a.applicant['numRated']
            if (b.applicant['numRated'] > 0) bRat = b.applicant['totalRating'] / b.applicant['numRated']

            return (e.target.getAttribute('polarity')) * (aRat - bRat)
        })
        this.setState({ applicationList: apps })
    }

    onSortName(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const apps = this.state.applicationList;

        apps.sort(function (a, b) {
            console.log(a.applicant.user.name)
            console.log(b.applicant.user.name)
            if (e.target.getAttribute('polarity') == 1)
                return a.applicant.user.name.localeCompare(b.applicant.user.name)
            else
                return b.applicant.user.name.localeCompare(a.applicant.user.name)
        })
        this.setState({ applicationList: apps })
    }

    onSortDate(e) {
        e.preventDefault();
        console.log(e.target.getAttribute('polarity'));
        const apps = this.state.applicationList;

        apps.sort(function (a, b) {
            console.log(a.date)
            console.log(b.date)
            if (e.target.getAttribute('polarity') == 1)
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            else
                return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        this.setState({ applicationList: apps })
    }

    render() {
        if (this.state.Loading)
            return (
                <h1>recViewAcc</h1>
            )

        if (this.state.applicationList.length !== 0)
            var applicationCards = this.state.applicationList.map(application =>
                <div className='card'>
                    <RecAppCard application={application} />
                </div>
            )
        else {
            var applicationCards = <h1>No applications yet</h1>
        }

        return (
            <div>
                <Row>
                    <Col >
                        sort-by-name
                    </Col>
                    <Col >
                        <Row>
                            <button id='name' polarity={1} onClick={this.onSortName}>asc</button>
                        </Row>
                        <Row>
                            <button id='salary' polarity={-1} onClick={this.onSortName}>desc
                            </button>
                        </Row>
                    </Col>
                    <Col >
                        sort-by-rating
                    </Col>
                    <Col >
                        <Row>
                            <button id='rating' polarity={1} onClick={this.onSortRating} >asc</button>
                        </Row>
                        <Row>
                            <button id='rating' polarity={-1} onClick={this.onSortRating} >desc
                                </button>
                        </Row>
                    </Col>
                    <Col >
                        sort-by-date
                    </Col>
                    <Col >
                        <Row>
                            <button id='date' polarity={1} onClick={this.onSortDate}>asc</button>
                        </Row>
                        <Row>
                            <button id='date' polarity={-1} onClick={this.onSortDate}>desc
                            </button>
                        </Row>
                    </Col>
                </Row>
                {applicationCards}
                {JSON.stringify(this.state.applicationList)}
            </div>
        )
    }
}
import axios from "axios";
import React, { Component } from "react";
import { Col, Row } from 'react-bootstrap';

export default class AppApplicationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Loading: false,
            rating: null,
        }
        this.onRate = this.onRate.bind(this)
        this.onChangeRating = this.onChangeRating.bind(this);
    }

    onRate() {
        if (!this.state.rating || this.state.rating > 5 || this.state.rating < 1) { alert('check the value of rating'); return; }
        var req = { application: this.props.application, rating: this.state.rating }
        console.log(req);
        axios.post('http://localhost:5000/applicant/rateJob', req).then(res => {
            console.log(res);
            alert('done!');
            this.setState({ rating: req.rating });
            window.location.reload(false);
        }).catch(err => {
            console.log(err);
        })
    }

    onChangeRating(e) {
        e.preventDefault();
        this.setState({ rating: e.target.value });
    }


    componentDidMount() {

    }

    render() {
        if (this.state.Loading) return (<h1>...Loading...</h1>);

        var status = <div>status: {this.props.application.status}</div>
        var deadline = new Date(this.props.application.job.deadline);
        var curDate = new Date()
        if (deadline < curDate) {
            console.log('expired')
            if (this.props.application.status === 'applied' || this.props.application.status === 'shortlisted')
                status = <div>status: expired</div>
        }

        var RateButton = <button style={{ backgroundColor: 'red' }}> already Rated </button>
        if (!this.props.application.jobRated) {
            console.log('not rated')
            RateButton = <div>
                <input type='number' min='1' max='5' onChange={this.onChangeRating} />
                <button value={this.state.rating} onClick={this.onRate} style={{ backgroundColor: 'green' }} onChange={this.onChangeRating}> rate! </button>
            </div>
        }

        var rating = 0
        if (this.props.application.job.numRated > 0) rating = this.props.application.job.totalRating / this.props.application.job.numRated

        return (
            <div>
                <Row>
                    <Col>
                        job title: {this.props.application.job.jobTitle} <br />
                        {status}
                recruiter name: {this.props.application.recruiter.user.name} <br/>
                rating: {rating}
                        {JSON.stringify(this.state.job)}
                    </Col>
                    <Col>
                        {RateButton}
                    </Col>
                </Row>
                date of applying: {this.props.application.date} <br/>
                date of joining: {this.props.application.accDate}
                {/* {JSON.stringify(this.state.rating)} */}

            </div>
        )
    }
}
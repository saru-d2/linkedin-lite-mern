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
                {applicationCards}
                {JSON.stringify(this.state.applicationList)}
            </div>
        )
    }
}
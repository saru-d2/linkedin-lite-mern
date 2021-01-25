import React, { Component } from 'react'
import axios from 'axios';

export default class Test extends Component {
    componentDidMount() {
        axios.post('http://localhost:5000/applicant').then(res => {
            console.log(res)
        }).catch(err => console.log(err))
    }

    render() {

        function yes() {
            console.log('Test')
            axios.post('http://localhost:5000/applicant').then(res => {
                console.log(res)
            }).catch(err => console.log(err))
        }

        return (
            <div>
                <h1>TESTING API</h1>
                <button onClick={yes} > TEST </button>
            </div>
        )
    }
} 

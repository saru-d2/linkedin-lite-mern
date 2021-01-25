import React, { Component } from 'react'
import axios from 'axios';
import emailjs from 'emailjs-com'

export default class Test extends Component {
    componentDidMount() {
        axios.post('http://localhost:5000/applicant').then(res => {
            console.log(res)
        }).catch(err => console.log(err))
    }

    render() {

        function yes() {
            emailjs.send('ssad.2019101016', 'ssad.template', { to_email: 'sarusenth@gmail.com', job: 'dog petting', to_name: 'app1' },'user_1bOBkzRuF9QtdqoZQxHNE')
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                }, (err) => {
                    console.log('FAILED...', err);
                });
        }

        return (
            <div>
                <h1>TESTING API</h1>
                <button onClick={yes} > TEST </button>
            </div>
        )
    }
} 

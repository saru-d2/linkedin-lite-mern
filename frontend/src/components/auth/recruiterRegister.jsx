import React, { Component, useState } from 'react';
import Creatable from 'react-select/creatable';
import '../../App.css'
const axios = require('axios');


export default class recruiterRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: sessionStorage.getItem('userEmail'),
            contactNo: '',
            bio: ''
        }
        this.onSubmit = this.onSubmit.bind(this);

    }

    onChangeContactNo(e) {
        this.setState({contactNo: e.target.value})
    }

    onChangeBio(e){
        this.setState({bio: e.target.value})
    }

    render() {
        return (
            <div></div>
        )
    }
}
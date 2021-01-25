import React, { Component } from 'react'
import axios from 'axios'

export default class AppEditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Loading: true
        }
    }


    render() {
        return(
            <h1>AppEditProfile</h1>
        )
    }
}
import { Navbar, Nav } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"

import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

export default class NavBar extends Component {

    constructor() {
        super();
        this.applicantElements = this.applicantElements.bind(this);
        this.loggedOutElements = this.loggedOutElements.bind(this);
        this.recruiterElements = this.recruiterElements.bind(this);
    }


    applicantElements() {
        if (this.props.userType && this.props.userType === 'applicant')
            return (
                <React.Fragment>
                    <Nav.Link href='/appViewJobs'>view jobs</Nav.Link>
                    <Nav.Link href='/'>applicant</Nav.Link>
                    <Nav.Link href='/appViewApplications'>see your applications</Nav.Link>
                    <Nav.Link href='/logout'>logout</Nav.Link>
                </React.Fragment>
            )
    }

    recruiterElements() {
        if (this.props.userType && this.props.userType === 'recruiter')
            return (
                <React.Fragment>
                    <Nav.Link href='/addJob'>add job</Nav.Link>
                    <Nav.Link href='/recViewJobs'>see jobs u posted</Nav.Link>
                    <Nav.Link href='/recViewAcc'>see accepted applicants</Nav.Link>
                    <Nav.Link href='/'>recruiter</Nav.Link>
                    <Nav.Link href='/logout'>logout</Nav.Link>
                </React.Fragment>
            )
    }

    loggedOutElements() {
        if (this.props.isLoggedIn === false) {
            console.log('bugger')
            return (
                <React.Fragment>
                    <Nav.Link href='/register'>register</Nav.Link>
                    <Nav.Link href='/signin'>sign in</Nav.Link>
                </React.Fragment>
            )
        }
    }

    render() {

        return (
            <div className='navBar'>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href='/' onClick={console.log(this.props.userType)}>Linkedin wannabe</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='mr-auto'>
                            {this.loggedOutElements()}
                            {this.applicantElements()}
                            {this.recruiterElements()}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}


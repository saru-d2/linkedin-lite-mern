import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, Button, Form, FormControl } from 'react-bootstrap'

export default class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        var userData = () => {
            if (sessionStorage.getItem("userName") !== '') {
                return (
                    <div className="Navbar">
                        <font color="white">logged in as: *{sessionStorage.getItem("userName")}*, {sessionStorage.getItem("userType")} </font>
                        <form action="/" class="btn btn-default">
                            <input type="submit" value="Logout" />
                        </form>
                    </div>
                );
            } else {
                return;
            }
        }


        return (
            <div>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="/">LinkedinWannabe</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/register">Register</Nav.Link>
                            <Nav.Link href="/signIn">SignIn</Nav.Link>

                            {/* now for the conditional links */}
                            <Nav.Link>**{sessionStorage.getItem('userName')}**</Nav.Link>
                            {userData()}
                        </Nav>

                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

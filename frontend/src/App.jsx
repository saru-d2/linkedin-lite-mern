import './App.css';
import { Component } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import Test from './test'
import NavBar from './components/Navbar';
import Register from './components/auth/register';
import ApplicantRegister from './components/auth/registerApplicant'
import RecruiterRegister from './components/auth/registerRecruiter'
import AddJob from './components/recruiter/addJob'
import RecViewJobs from './components/recruiter/recViewJobs'
import AppViewJobs from './components/applicant/appViewJobs'
import AppJobCardDetails from './components/applicant/appJobCardDetails'
import RecJobCardDetails from './components/recruiter/recJobCardDetails'
import RecSeeJobApps from './components/recruiter/recSeeJobApps'
import AppViewApplications from './components/applicant/appViewApplications'
import RecEditJob from './components/recruiter/recEditJob'
import RecViewAcc from './components/recruiter/recViewAcc'
import RecEditProfile from './components/recruiter/recEditProfile'
import AppEditProfile from './components/applicant/appEditProfile'

const Signin = require('./components/auth/signin').default;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userEmail: null,
      userName: null,
      userType: null,
      userToken: null
    };
    this.onLogOut = this.onLogOut.bind(this);
    this.onLogIn = this.onLogIn.bind(this);
  }

  onLogIn(token) {
    localStorage.setItem('userToken', token);
    if (token) {
      console.log(`token ` + token)
      axios.defaults.headers.common['authToken'] = token;
    } else {
      delete axios.defaults.headers.common['authToken']; //sets to null
    }
    const decodedUser = jwt_decode(token);
    console.log(decodedUser);
    this.setState({
      isLoggedIn: true,
      userName: decodedUser.name,
      userEmail: decodedUser.email,
      userType: decodedUser.type,
      userToken: token
    });
  }

  onLogOut() {
    localStorage.removeItem('userToken');

    delete axios.defaults.headers.common['authToken']; //sets to null

    this.setState({
      isLoggedIn: true,
      userName: null,
      userEmail: null,
      userType: null,
      userToken: null
    });

    return (
      <div>
        <Redirect to='/' />
        <h2>logged out succesfully</h2>
        {window.location.replace('http://localhost:3000/')}
      </div>
    )
  }

  //occurs once
  componentWillMount() {
    console.log('app mounting');
    if (localStorage)
      if (localStorage.userToken) {
        console.log('signed in with token ' + localStorage.userToken)
        this.onLogIn(localStorage.userToken);
      }
  }

  render() {
    return (
      <Router>
        <NavBar isLoggedIn={this.state.isLoggedIn} userType={this.state.userType} />
        <div style={{ marginLeft: '5%', marginRight: '20%' }}>
          <h1>Hi {this.state.userEmail}</h1>

          <Route exact path='/test' component={Test} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/registerApplicant/:id' component={ApplicantRegister} />
          <Route exact path='/registerRecruiter/:id' component={RecruiterRegister} />
          <Route exact path='/signin' render={
            props => <Signin onLogIn={this.onLogIn} />} />
          <Route exact path="/logout" render={this.onLogOut} />

          <Route exact path="/addjob" render={props =>
            <AddJob userEmail={this.state.userEmail} />} />

          <Route exact path="/recviewjobs" render={props =>
            <RecViewJobs userEmail={this.state.userEmail} />} />

          <Route exact path="/appviewjobs" render={props =>
            <AppViewJobs userEmail={this.state.userEmail} />} />

          <Route exact path="/appjobcarddetails" render={props =>
            <AppJobCardDetails userEmail={this.state.userEmail} jobId={props.location.state.jobId} />} />

          <Route exact path="/recjobcarddetails" render={props =>
            <RecJobCardDetails userEmail={this.state.userEmail} jobId={props.location.state.jobId} />} />

          <Route exact path="/recseejobapps" render={props =>
            <RecSeeJobApps userEmail={this.state.userEmail} jobId={props.location.state.jobId} />} />

          <Route exact path="/recEditJob" render={props =>
            <RecEditJob userEmail={this.state.userEmail} jobId={props.location.state.jobId} />} />

          <Route exact path="/appviewapplications" render={props =>
            <AppViewApplications userEmail={this.state.userEmail} />} />

          <Route exact path="/recViewAcc" render={props =>
            <RecViewAcc userEmail={this.state.userEmail} />} />
          <Route exact path="/recEditProfile" render={props =>
            <RecEditProfile userEmail={this.state.userEmail} />} />
            <Route exact path="/appEditProfile" render={props =>
            <AppEditProfile userEmail={this.state.userEmail} />} />
        </div>
      </Router>
    )
  }
}

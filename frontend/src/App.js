import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import Home from './components/Home';
import Register from './components/auth/Register';
import SignIn from './components/auth/Signin';
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* <h1>this is app.js </h1> */}
        <br />
        <br />
        <Route path="/" exact component={Home}/>
        <Route path="/register" component={Register} />
        <Route path="/signin" component={SignIn} />
      </div>
    </Router>
  );
}

export default App;

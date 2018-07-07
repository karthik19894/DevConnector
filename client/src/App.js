import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import './App.css';
import {Provider} from 'react-redux';
import store from './store';




class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
          <Navbar/>
          <Route exact path="/" component={Landing}/>
          <div className="container">
            <Route exact path="/login" component={Login}/>
          </div>
          <div className="container">
            <Route exact path="/register" component={Register}/>
          </div>
          <Footer/>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

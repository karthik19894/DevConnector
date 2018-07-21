import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './actions/authActions';


//Check for token

if(localStorage.jwtToken){
	//Set auth token header
	setAuthToken(localStorage.jwtToken);
	//Decode token and get user info and expiry
	const decoded=jwt_decode(localStorage.jwtToken);
	//Set user and authenticated
	store.dispatch(setCurrentUser(decoded));

	//Check for expired token
	const currentTime=Date.now()/1000;
	if(decoded.exp<currentTime){
		store.dispatch(logoutUser());
		//Clear Current Profile

		//Redirect to Login
		window.location.href='/login';
	}


}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="container">
							<Route exact path="/login" component={Login} />
						</div>
						<div className="container">
							<Route exact path="/register" component={Register} />
						</div>
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

let devTools = null;

if (process.env.NODE_ENV !== 'production') {
	devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
}

const store = createStore(
	rootReducer,
	initialState,
	compose(
		applyMiddleware(...middleware),
		devTools
	)
);

export default store;

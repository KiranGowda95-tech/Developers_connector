import {configureStore,applyMiddleware} from '@reduxjs/toolkit';
import {composeWithDevTools} from 'redux-devtools-extension';
//import thunk from 'redux-thunk';
import reduxPromise from 'redux-promise'
import rootReducer from './reducers'

const initialState={}

const middleware=[reduxPromise];

// const store=configureStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// )

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware), // Add custom middleware
    devTools: process.env.NODE_ENV !== 'production', // Enable devtools in development
  });
export default store

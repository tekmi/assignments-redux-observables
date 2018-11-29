import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import {combineEpics, createEpicMiddleware} from "redux-observable";

import App from './App';
import rootReducer from './store/reducers/index';
const loggerMiddleware = createLogger();
const composeEnhancers = (MODE === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose;

import {authEpic, registerEpic} from "./store/epics/authEpic";
import {userDeleteEpic, userGetEpic, userUpdateEpic} from "./store/epics/userEpic";

const epicMiddleware = createEpicMiddleware();

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            epicMiddleware,
            loggerMiddleware,
        ))
);

epicMiddleware.run(
    combineEpics(
        registerEpic,
        authEpic,
        userGetEpic,
        userUpdateEpic,
        userDeleteEpic
    )
);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

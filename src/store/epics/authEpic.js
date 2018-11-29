import * as actionTypes from './../actions/actionTypes';
import { axios} from './../../helpers/axios';
import jwt_decode from 'jwt-decode';
import {catchError, filter, map, mergeMap, switchMap, take, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {ofType} from "redux-observable";

export const registerInit = (data) => ({
    type: actionTypes.REGISTER_START,
    payload: data
});

export const authInit = (email, password) => ({
    type: actionTypes.AUTH_START,
    email: email,
    pass: password
});

export const authEpic = action$ => action$.pipe(
    ofType(actionTypes.AUTH_START),
    // TODO: there should be easy to stop it or take only the last call, but it didn't work actually.
    mergeMap(action => {
        let data = {
            "username": action.email,
            "password": action.pass
        };

        return Observable.create(observer => {
            axios.post("/login_check", data)
                .then(response => {
                    const decoded = jwt_decode(response.data.token);
                    let user = {
                        id: decoded.user_id,
                        email: decoded.username
                    };
                    const expirationDate = new Date(decoded.exp*1000);

                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('expirationDate', expirationDate.toISOString());
                    localStorage.setItem('user', JSON.stringify(user));

                    observer.next({
                        token: response.data.token,
                        user: user
                    });
                    observer.complete();
                })
                .catch(err => {
                    observer.error(err);
                });
        })
        .pipe(
            tap(console.info),
            map(res => {
                return authSuccess(res.token, res.user);
            }),
            catchError(err => Promise.resolve(authFail(err)))
        )
    })
);

export const registerEpic = action$ => action$.pipe(
    filter(action => action.type === actionTypes.REGISTER_START),
    switchMap(action => {

        let data = action.payload;

        let dataSend = {
            "email": data.email,
            "name": data.name,
            "companyName": data.companyName,
            "password": data.password,
            "addresses": [
                {
                    "street": data.billingAddress,
                    "city": data.billingCity,
                    "postalCode": data.billingPostalCode,
                    "countryCode": data.billingCountry
                }
            ]
        };

        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            }
        };

        return Observable.create(observer => {
                axios.post("/users", dataSend, config)
                    .then(response => {
                        console.log('Email observ', response.data.email);
                        // dispatch(registerSuccess(response.data.email));

                        observer.next(response.data.email);
                        observer.complete();
                    })
                    .catch(err => {
                        observer.error(err);

                        return registerFail(err);
                    });
            }
        )
        .pipe(
            map(registerSuccess),
            catchError(err => Promise.resolve(registerFail(err)))
        );
    })
);

export const authSuccess = (token, user) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        user: user
    }
};

export const authFail = (errorMessage) => {
    return {
        type: actionTypes.AUTH_FAIL,
        errorMessage: errorMessage
    }
};

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('user');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const authCheckState = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return authLogout();
    }

    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
        return authLogout();
    }

    const user = JSON.parse(localStorage.getItem('user'));

    return authSuccess(token, user);
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const registerSuccess = (email) => {
    return {
        type: actionTypes.REGISTER_SUCCESS,
        registeredEmail: email
    }
};

export const registerFail = (errorMessage) => {
    return {
        type: actionTypes.REGISTER_FAIL,
        errorMessage: errorMessage
    }
};

export const registerCleanup = (email) => {
    localStorage.setItem('lastRegisteredEmail', email);
    return {
        type: actionTypes.REGISTER_CLEANUP,
    }
};


import * as actionTypes from './../actions/actionTypes';
import {axios} from './../../helpers/axios';
import {Observable} from "rxjs";
import {catchError, mergeMap, tap, map} from "rxjs/operators";
import {ofType} from "redux-observable";
import {authLogout} from "./authEpic";


export const userGetStart = (token, userId) => {
    return {
        type: actionTypes.USER_GET_START,
        token: token,
        usr: userId
    }
};

export const userGetSuccess = (userDetails) => {
    return {
        type: actionTypes.USER_GET_SUCCESS,
        userDetails: userDetails
    }
};

export const userGetFail = (errorMessage) => {
    return {
        type: actionTypes.USER_GET_FAIL,
        errorMessage: errorMessage
    }
};


export const userGetEpic = action$ => action$.pipe(
    ofType(actionTypes.USER_GET_START),
    mergeMap(action => {
        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${action.token}`
            }
        };

        return Observable.create(observer => {
            axios.get(`/users/${action.usr}`, config)
                .then(response => {
                    let userDetails = {
                        id: response.data.id,
                        name: response.data.name,
                        companyName: response.data.companyName,
                        billingAddress: response.data.addresses[0].street,
                        billingCity: response.data.addresses[0].city,
                        billingPostalCode: response.data.addresses[0].postalCode,
                        billingCountry: response.data.addresses[0].countryCode,
                        billingAddressUri: response.data.addresses[0]['@id']
                    };

                    observer.next(userDetails);
                    observer.complete();
                })
                .catch(err => {
                    observer.error(err);
                });
        })
        .pipe(
            tap(console.info),
            map(userGetSuccess),
            catchError(err => Promise.resolve(userGetFail(err)))
        )
    })
);

export const userUpdateStart = (token, userId, userDetails) => {
    return {
        type: actionTypes.USER_UPDATE_START,
        token: token,
        usr: userId,
        userDet: userDetails
    }
};

export const userUpdateSuccess = (userDetails) => {
    return {
        type: actionTypes.USER_UPDATE_SUCCESS,
        userDetails: userDetails
    }
};

export const userUpdateFail = (errorMessage) => {
    return {
        type: actionTypes.USER_UPDATE_FAIL,
        errorMessage: errorMessage
    }
};


export const userUpdateEpic = action$ => action$.pipe(
    ofType(actionTypes.USER_UPDATE_START),
    mergeMap(action => {
        let userDetails = action.userDet;

        let data = {
            "name": userDetails.name,
            "companyName": userDetails.companyName,
            "addresses": [
                {
                    "@id": userDetails.billingAddressUri,
                    "street": userDetails.billingAddress,
                    "city": userDetails.billingCity,
                    "postalCode": userDetails.billingPostalCode,
                    "countryCode": userDetails.billingCountry
                }
            ]
        };

        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${action.token}`
            }
        };

        return Observable.create(observer => {
            axios.put(`/users/${action.usr}`, data, config)
                .then(response => {
                    let userDetails = {
                        id: response.data.id,
                        name: response.data.name,
                        companyName: response.data.companyName,
                        billingAddress: response.data.addresses[0].street,
                        billingCity: response.data.addresses[0].city,
                        billingPostalCode: response.data.addresses[0].postalCode,
                        billingCountry: response.data.addresses[0].countryCode,
                        billingAddressUri: response.data.addresses[0]['@id']
                    };

                    observer.next(userDetails);
                    observer.complete();
                })
                .catch(err => {
                    observer.error(err);
                });
        })
        .pipe(
            tap(console.info),
            map(userUpdateSuccess),
            catchError(err => Promise.resolve(userUpdateFail(err)))
        )
})
);

export const userDeleteStart = (token, userId) => {
    return {
        type: actionTypes.USER_DELETE_START,
        tok: token,
        usr: userId,
    }
};

export const userDeleteSuccess = () => {
    return {
        type: actionTypes.USER_DELETE_SUCCESS,
    }
};

export const userDeleteFail = (errorMessage) => {
    return {
        type: actionTypes.USER_DELETE_FAIL,
        errorMessage: errorMessage
    }
};

// export const userUpdateEpic = action$ => action$.pipe(
//     ofType(actionTypes.USER_UPDATE_START),

export const userDeleteEpic = action$ => action$.pipe(
    ofType(actionTypes.USER_DELETE_START),
    mergeMap(action => {

        const config = {
            "headers": {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
                'Authorization': `Bearer ${action.tok}`
            }
        };

        return Observable.create(observer => {
            axios.delete(`/users/${action.usr}`, config)
                .then(response => {
                    observer.next();
                    observer.complete();
                    // dispatch(userDeleteSuccess());
                    // dispatch(authLogout());
                })
                .catch(err => {
                    observer.error(err);
                    // dispatch(userDeleteFail(err.response.data.errorMessage));
                });
        })
        .pipe(
            tap(console.warn),
            map(userDeleteSuccess),
            map(authLogout),
            catchError(err => Promise.resolve(userDeleteFail(err)))
        )
    })
);

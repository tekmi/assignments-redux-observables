import React, {Component} from 'react';
import {connect} from 'react-redux';
import {registerCleanup, registerInit} from "../../../store/epics/authEpic";
import classes from './../../../App.css';

import {axios} from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import {NavLink, Redirect} from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: {value: '', error: '', touched: false},
            name: {value: '', error: '', touched: false},
            companyName: {value: '', error: '', touched: false},
            password: {value: '', error: '', touched: false},
            billingAddress: {value: '', error: '', touched: false},
            billingCity: {value: '', error: '', touched: false},
            billingPostalCode: {value: '', error: '', touched: false},
            billingCountry: {value: '', error: '', touched: false},
            isValid: false
        }
    }

    submitHandler = (event) => {
        event.preventDefault();

        if (event.target.checkValidity() === false) {
            return;
        }

        let data = Object.keys(this.state).reduce((result, key) => {
            if (typeof this.state[key] === 'object') {
                result[key] = this.state[key].value;
            }
            return result;
        }, {});

        this.props.onRegisterSubmit(data);
    };

    inputChangedHandler = (event) => {
        this.setState({
            [event.target.id]: {
                ...this.state[event.target.id],
                value: event.target.value,
                touched: true,
                error: event.target.checkValidity() === false ? event.target.validationMessage : ''
            },
            isValid: event.target.form.checkValidity()
        });
    };

    render() {
        const redirectAfterSuccessfulRegistration = this.props.registeredEmail ? <Redirect to="/login"/> : null;
        if (redirectAfterSuccessfulRegistration) {
            this.props.afterRegisterCleanup(this.props.registeredEmail);
        }

        let registration = <Spinner/>;
        if (!this.props.loading) {
            registration = (
                <form method="post" noValidate onSubmit={(event) => this.submitHandler(event)}>
                    <div className={this.state.email.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="email">Email address</label>
                        <input type="email" name="email" className="form-control" id="email"
                               aria-describedby="emailHelp" placeholder="Please enter email"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.email.value}
                               required="required"/>
                        <div className="invalid-feedback">{this.state.email.error}</div>
                    </div>
                    <div className={this.state.password.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="form-control" id="password" minLength="6"
                               placeholder="Please enter password"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.password.value}
                               required="required"/>
                        <div className="invalid-feedback">{this.state.password.error}</div>
                    </div>
                    <div className={this.state.name.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="name">Name</label>
                        <input type="name" name="name" className="form-control" id="name"
                               aria-describedby="nameHelp" placeholder="Please enter name"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.name.value}
                               required="required"
                               minLength="2" />
                        <div className="invalid-feedback">{this.state.name.error}</div>
                    </div>
                    <div className={this.state.companyName.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="companyName">Company Name</label>
                        <input type="companyName" name="companyName" className="form-control" id="companyName"
                               aria-describedby="companyNameHelp" placeholder="Please enter company name"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.companyName.value}
                               minLength="2" />
                        <div className="invalid-feedback">{this.state.companyName.error}</div>
                    </div>
                    <div className={this.state.billingAddress.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="billingAddress">Billing Address</label>
                        <input type="text" className="form-control" name="billing_address" id="billingAddress"
                               minLength="2"
                               placeholder="Please enter street"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.billingAddress.value}
                               required="required"/>
                        <div className="invalid-feedback">{this.state.billingAddress.error}</div>
                    </div>
                    <div className={this.state.billingCity.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="billingCity">Billing City</label>
                        <input type="text" className="form-control" name="billing_city" id="billingCity"
                               minLength="2"
                               placeholder="Please enter city"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.billingCity.value}
                               required="required"/>
                        <div className="invalid-feedback">{this.state.billingCity.error}</div>
                    </div>
                    <div className={this.state.billingPostalCode.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="billingPostalCode">Billing Postal Code</label>
                        <input type="text" className="form-control" name="billing_postal_code" id="billingPostalCode"
                               placeholder="Please enter postal code"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.billingPostalCode.value}
                               required="required"
                               pattern="[0-9A-Za-z\-_\s]{2,}"
                               title="Alphanumeric chars, minimum 2"/>
                        <div className="invalid-feedback">{this.state.billingPostalCode.error}</div>
                    </div>
                    <div className={this.state.billingCountry.touched ? 'form-group was-validated' : 'form-group'}>
                        <label htmlFor="billingCountry">Billing Country</label>
                        <select className="form-control" id="billingCountry" name="billing_country"
                                onChange={(event) => this.inputChangedHandler(event)}
                                onBlur={(event) => this.inputChangedHandler(event)}
                                value={this.state.billingCountry.value}
                                required="required">
                            <option value="">Please choose country</option>
                            <option value="US">USA</option>
                            <option value="AU">Australia</option>
                            <option value="AT">Austria</option>
                            <option value="BE">Belgium</option>
                            <option value="BR">Brazil</option>
                            <option value="CA">Canada</option>
                            <option value="CN">China</option>
                            <option value="DK">Denmark</option>
                            <option value="FI">Finland</option>
                            <option value="FR">France</option>
                            <option value="IN">India</option>
                            <option value="IE">Ireland</option>
                            <option value="IT">Italy</option>
                            <option value="JP">Japan</option>
                            <option value="LU">Luxembourg</option>
                            <option value="NL">Netherlands</option>
                            <option value="NO">Norway</option>
                            <option value="PL">Poland</option>
                            <option value="PT">Portugal</option>
                            <option value="RO">Romania</option>
                            <option value="RU">Russian Federation</option>
                            <option value="SE">Sweden</option>
                            <option value="CH">Switzerland</option>
                            <option value="TR">Turkey</option>
                            <option value="UA">Ukraine</option>
                        </select>
                        <div className="invalid-feedback">{this.state.billingCountry.error}</div>
                    </div>
                    <div className={classes.FormNavButtons}>
                        <button type="submit" className="btn btn-success" disabled={!this.state.isValid}>Sign up</button>
                        <NavLink className="btn btn-primary" to="/login">Log in if you already have an account</NavLink>
                    </div>
                </form>
            );
        }

        return (
            <div className="container text-left">
                <h1>Registration</h1>
                {redirectAfterSuccessfulRegistration}
                {registration}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        registeredEmail: state.auth.registered_email
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRegisterSubmit: (data) => dispatch(registerInit(data)),
        afterRegisterCleanup: (email) => dispatch(registerCleanup(email))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Register, axios));

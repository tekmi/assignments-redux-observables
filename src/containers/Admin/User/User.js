import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";
import {connect} from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";
import {axios} from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";
import classes from './../../../App.css';
import { NavLink } from 'react-router-dom';
import {userGetStart, userUpdateStart} from "../../../store/epics/userEpic";

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: {value: '', error: '', touched: false},
            companyName: {value: '', error: '', touched: false},
            billingAddress: {value: '', error: '', touched: false},
            billingCity: {value: '', error: '', touched: false},
            billingPostalCode: {value: '', error: '', touched: false},
            billingCountry: {value: '', error: '', touched: false},
            billingAddressUri: '',
            isValid: false
        }
    }

    componentDidMount () {
        console.log(this.props.user.id);
        this.props.onUserGet(this.props.token, this.props.user.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userDetails) {
            this.setState({
                name: {
                    ...this.state.name,
                    value: nextProps.userDetails.name
                },
                companyName: {
                    ...this.state.companyName,
                    value: nextProps.userDetails.companyName ? nextProps.userDetails.companyName : ''
                },
                billingAddress: {
                    ...this.state.billingAddress,
                    value: nextProps.userDetails.billingAddress
                },
                billingCity: {
                    ...this.state.billingCity,
                    value: nextProps.userDetails.billingCity
                },
                billingPostalCode: {
                    ...this.state.billingPostalCode,
                    value: nextProps.userDetails.billingPostalCode
                },
                billingCountry: {
                    ...this.state.billingCountry,
                    value: nextProps.userDetails.billingCountry
                },
                billingAddressUri: nextProps.userDetails.billingAddressUri
            });
        }
    }

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

    submitHandler = (event) => {
        event.preventDefault();

        if (event.target.checkValidity() === false) {
            return;
        }

        let userDetails = Object.keys(this.state).reduce((result, key) => {
            if (typeof this.state[key] === 'object') {
                result[key] = this.state[key].value;
            }
            return result;
        }, {});

        userDetails['billingAddressUri'] = this.state.billingAddressUri;

        this.props.onUserUpdate(this.props.token, this.props.user.id, userDetails);
    };

    render() {
        let userDetails = <Spinner/>;
        if (!this.props.loading) {
            userDetails = (
                <div className="container text-left">
                    <form method="post" noValidate onSubmit={(event) => this.submitHandler(event)}>
                        <div className='form-group'>
                            <label htmlFor="email">Email address</label>
                            <input disabled={true} type="email" name="email" className="form-control" id="email"
                                   aria-describedby="emailHelp" placeholder="Please enter email"
                                   value={this.props.user.email}
                                   required="required"/>
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
                        <div
                            className={this.state.billingPostalCode.touched ? 'form-group was-validated' : 'form-group'}>
                            <label htmlFor="billingPostalCode">Billing Postal Code</label>
                            <input type="text" className="form-control" name="billing_postal_code"
                                   id="billingPostalCode"
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
                            <button type="submit" className="btn btn-success" disabled={!this.state.isValid}>Update</button>
                            <NavLink className="btn btn-danger" to="/user-delete">Delete my account</NavLink>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div>
                <Toolbar/>
                <h3>Editing user: <i>{this.props.user.email}</i></h3>
                {userDetails}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        token: state.auth.token,
        loading: state.user.loading,
        userDetails: state.user.user_details
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onUserGet: (token, userId) => dispatch(userGetStart(token, userId)),
        onUserUpdate: (token, userId, userDetails) => dispatch(userUpdateStart(token, userId, userDetails))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(User, axios));

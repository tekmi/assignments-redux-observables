import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";
import {connect} from "react-redux";
import {axios} from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";
import {userDeleteStart} from "../../../store/epics/userEpic";

class UserDelete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reallyDelete: false
        }
    }

    inputChangedHandler = (event) => {
        this.props.onUserDelete(this.props.token, this.props.user.id);
    };

    render() {
        return (
            <div>
                <Toolbar/>
                <h3>Deleting user: <i>{this.props.user.email}</i></h3>
                <br/><br />
                <button type="submit" className="btn btn-danger" onClick={(event) => this.inputChangedHandler(event)}>Delete my account right now and log me out</button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        token: state.auth.token,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onUserDelete: (token, userId) => dispatch(userDeleteStart(token, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(UserDelete, axios));

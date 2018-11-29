import React, {Component} from 'react';
import Wrapper from "./Wrapper";
import Modal from "../components/UI/Modal/Modal";

const withErrorHandler = ( WrappedComponent, axios ) => {
    return class extends Component {
        state = {
            error: null
        };

        componentWillMount() {
            this.requestInterceptor = axios.interceptors.request.use(req => {
                this.setState({
                    error: null
                });

                return req;
            });

            this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
                let errorMessage = error.response.data.message || null;
                if (!errorMessage) {
                    errorMessage = error.response.data['hydra:description'].replace(/addresses\[0\]\./gi, '');
                }

                console.log('Inter', errorMessage);

                this.setState({
                    error: errorMessage
                });

                return Promise.reject(error);
            });
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({
                error: null
            });
        };

        render() {
            return (
                <Wrapper>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.split('\n').map((item, key) => {
                            return (
                                <Wrapper key={key}>
                                    {item}
                                    <br />
                                </Wrapper>
                            );
                        }) : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Wrapper>
            );
        }
    }
};

export default withErrorHandler;

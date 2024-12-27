import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({children,auth:{ isAuthenticated, loading }}) => {
    if(!isAuthenticated && !loading){
        return <Navigate to='/login'/>
    }
  return children
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  loading:PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);

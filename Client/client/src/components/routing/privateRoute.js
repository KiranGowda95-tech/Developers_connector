import React from "react";
import PropTypes from "prop-types";
import { Outlet, Navigate } from "react-router-dom";
import { connect } from "react-redux";

const privateRoute = ({ isAuthenticated, loading }) => {
    if(!isAuthenticated && !loading){
        return <Navigate to='/login'/>
    }
  return <Outlet/>
};

privateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  loading:PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(privateRoute);

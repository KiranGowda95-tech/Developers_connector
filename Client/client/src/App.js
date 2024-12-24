import React, { Fragment,useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import privateRoute from "./components/routing/privateRoute";
import "./App.css";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

if(localStorage.token){
  setAuthToken(localStorage.token);
}
const App = () =>{  
  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <div className="container">
          <Alert />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='/dashboard' element={
              <privateRoute>
                <Dashboard/>                
              </privateRoute>
            } />
            <Route path='/create-profile' element={
              <privateRoute>
                <CreateProfile/>                
              </privateRoute>
            } />
          </Routes>
        </div>
      </Fragment>
    </Router>
  </Provider>
);
}

export default App;

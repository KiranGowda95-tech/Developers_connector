import React, { Fragment, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import {LOGOUT} from "./actions/types";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import PrivateRoute from "./components/routing/PrivateRoute";
import "./App.css";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";


const App = () => {
  useEffect(() => {

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

        store.dispatch(loadUser());


    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });

  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Alert />
          <div className="container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route
                path="dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="create-profile"
                element={
                  <PrivateRoute>
                    <CreateProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="edit-profile"
                element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="add-experience"
                element={
                  <PrivateRoute>
                    <AddExperience />
                  </PrivateRoute>
                }
              />
              <Route
                path="add-education"
                element={
                  <PrivateRoute>
                    <AddEducation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/posts"
                element={
                  <PrivateRoute>
                    <Posts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <PrivateRoute>
                    <Post />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

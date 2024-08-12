import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import useStyles from "./styles";
import decode from 'jwt-decode';
import memoriesLogo from '../../images/memories-Logo.png'
import memoriesText from '../../images/memories-Text.png'
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as actionType from '../../constants/actionTypes';

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  const getInitals = () => {
    const userArray = user.result.name.split(" ");
    if(userArray.length == 2) {
      return user.result.name.split(" ")[0].charAt(0) + user.result.name.split(" ")[1].charAt(0);
    } else {
      return user.result.name.charAt(0);
    }
  }

  const logout = () => {
    // Will update auth reducer to remove profile from localStorage
    dispatch({ type: actionType.LOGOUT })

    // Redirect back to home page
    history.push("/auth");

    // Sets user back to null because of logout
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    // Check if token has expired
    if(token) {
      const decodedToken = decode(token);

      if(decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img component={Link} to="/" src={memoriesText} alt="icon" height="45px" />
        <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
      </Link>
      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{getInitals()}</Avatar>
            <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant='contained' color='primary'>Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
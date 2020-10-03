import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CotterContext from "../contexts/userContext";
import logo from "../misc/logo.png";

const useStyles = makeStyles({
  root: {
    width: "97%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "13vh",
  },
  logo: {
    width: 80,
    height: 80,
  },
  titleGroup: {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  title: {
    fontSize: "2.8rem",
    letterSpacing: "0.8rem",
    fontWeight: 900,
    marginBottom: 0,
    marginTop: 0,
  },
  developer: {
    margin: 0,
    fontSize: "1rem",
    letterSpacing: "0.3rem",
    fontWeight: 300,
  },
  loginLink: {
    textDecoration: "none",
    color: "black",
  },
  loginButton: {
    padding: "20px 30px",
    borderRadius: 50,
  },
});

const Navbar = (props) => {
  const classes = useStyles();
  const { isLoggedIn, logout, user } = useContext(CotterContext);
  let userDisplay = "";
  if (user) {
    userDisplay = user.identifier;
  }
  return (
    <div className={classes.root}>
      <img src={logo} className={classes.logo} />
      <div className={classes.titleGroup}>
        <h1 className={classes.title}>blend</h1>
        <h5 className={classes.developer}>by nongki</h5>
      </div>
      {isLoggedIn ? (
        <div>
          <Button className={classes.loginButton} disabled>
            {userDisplay}
          </Button>
          <Button className={classes.loginButton} onClick={logout}>
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <Link to="/login" className={classes.loginLink}>
            <Button className={classes.loginButton}>
              <a>Sign In</a>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;

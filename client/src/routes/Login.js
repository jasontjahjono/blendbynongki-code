import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import Cotter from "cotter";
import CotterContext from "../contexts/userContext";
import { COTTER_API_KEY_ID } from "../apiKeys";
import logo from "../misc/logo.png";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#fff4e3",
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  paper: {
    marginTop: "10%",
    height: 350,
    padding: 50,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    background: "linear-gradient(45deg, #964B00 30%, #BC7434 80%)",
    border: 0,
    borderRadius: 50,
    color: "white",
    height: 50,
    padding: "0 25px",
    textTransform: "lowercase",
    fontSize: "1rem",
  },
  title: {
    fontSize: "4.5rem",
    margin: 0,
    letterSpacing: "0.3rem",
    fontWeight: 900,
    position: "absolute",
    top: 30,
  },
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Login = (props) => {
  const { checkLoggedIn } = useContext(CotterContext);
  const classes = useStyles();
  let query = useQuery();
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //  2️⃣ Initialize and show the form
  useEffect(() => {
    if (query.get("err") === "unauthenticated") {
      setOpen(true);
    }
    var cotter = new Cotter(COTTER_API_KEY_ID); // 👈 Specify your API KEY ID here
    cotter
      .signInWithLink() // use .signInWithOTP() to send an OTP
      .showEmailForm() // use .showPhoneForm() to send magic link to a phone number
      .then((response) => {
        checkLoggedIn();
        props.history.push("/");
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Button
          className={classes.backButton}
          variant="contained"
          onClick={() => props.history.push("/")}
        >
          <ArrowBackIosRoundedIcon />
          back
        </Button>
        <h1 className={classes.title}>Sign In</h1>
        {/*  3️⃣  Put a <div> that will contain the form */}
        <Paper elevation={4} className={classes.paper}>
          <img src={logo} className={classes.logo} />
          <div id="cotter-form-container" style={{ width: 300, height: 250 }} />
        </Paper>
      </div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          You Must Sign In Before Entering a Room
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;

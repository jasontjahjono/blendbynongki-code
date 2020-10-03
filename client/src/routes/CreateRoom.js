import React, { useState, useContext } from "react";
import { v1 as uuid } from "uuid";
import Navbar from "../components/Navbar";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import TextField from "@material-ui/core/TextField";
import artwork from "../misc/landing_coffeeshop.png";
import CotterContext from "../contexts/userContext";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#964B00",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: 50,
      },
      "&.Mui-focused fieldset": {
        borderColor: "#964B00",
      },
    },
  },
})(TextField);

const useStyles = makeStyles({
  root: {
    backgroundColor: "#fff4e3",
  },
  container: {
    display: "flex",
    height: "87vh",
    width: "100%",
  },
  textGroup: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: "10%",
    justifyContent: "center",
    width: "55%",
    textAlign: "center",
    "& h1": {
      fontSize: "4.5rem",
      margin: 0,
      letterSpacing: "0.3rem",
      fontWeight: 900,
    },
  },
  formGroup: {
    display: "flex",
    width: "70%",
    height: 100,
    margin: "0 auto",
    justifyContent: "center",
    alignItems: "center",
  },
  newButton: {
    background: "linear-gradient(45deg, #964B00 30%, #BC7434 80%)",
    border: 0,
    borderRadius: 50,
    color: "white",
    height: 56,
    padding: "0 35px",
    textTransform: "lowercase",
    fontSize: "1rem",
  },
  joinButton: {
    marginLeft: 10,
    borderRadius: 50,
  },
  buttonGroup: {
    alignSelf: "center",
    marginTop: 40,
  },
  input: {
    width: 350,
  },
  or: {
    margin: "0 20px",
    fontWeight: 600,
  },
  artwork: {
    position: "relative",
    height: "105%",
    bottom: 60,
  },
  textField: {
    display: "flex",
    alignItems: "center",
  },
});

const CreateRoom = (props) => {
  const classes = useStyles();
  const { isLoggedIn } = useContext(CotterContext);
  const [scene, setScene] = useState("coffeeshop");
  const [value, setValue] = useState("");

  const handleScene = (event, newScene) => {
    setScene(newScene);
  };

  const create = () => {
    if (isLoggedIn) {
      const id = uuid();
      props.history.push(`/room/${id}?scene=${scene}`);
    } else {
      props.history.push("/login?err=unauthenticated");
    }
  };

  const handleSubmit = () => {
    if (isLoggedIn) {
      const route = value.split("/room/")[1];
      props.history.push(`/room/${route}`);
    } else {
      props.history.push("/login?err=unauthenticated");
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.container}>
        <div className={classes.textGroup}>
          <h1>virtual coffee,</h1>
          <h1>real company</h1>
          <ToggleButtonGroup
            className={classes.buttonGroup}
            value={scene}
            exclusive
            onChange={handleScene}
          >
            <ToggleButton value="coffeeshop">coffeeshop</ToggleButton>
            <ToggleButton value="picnic">picnic</ToggleButton>
          </ToggleButtonGroup>
          <div className={classes.formGroup}>
            <Button
              className={classes.newButton}
              variant="contained"
              onClick={create}
            >
              create room
            </Button>
            <p className={classes.or}>or</p>
            <form
              className={classes.textField}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <CssTextField
                className={classes.input}
                id="outlined-basic"
                label="enter a room link"
                variant="outlined"
                value={value}
                onChange={handleChange}
              />
              <Button className={classes.joinButton} type="submit">
                join
              </Button>
            </form>
          </div>
        </div>
        <img src={artwork} className={classes.artwork} />
      </div>
    </div>
  );
};

export default CreateRoom;

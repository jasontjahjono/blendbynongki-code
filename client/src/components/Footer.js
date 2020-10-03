import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#fff4e3",
    height: "7vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "-4px -6px 44px -19px rgba(51,51,51,0.75)",
  },
  leaveButton: {
    background: "linear-gradient(45deg, #964B00 30%, #BC7434 80%)",
    border: 0,
    borderRadius: 50,
    color: "white",
    height: 45,
    padding: "0 15px",
    textTransform: "lowercase",
    fontSize: "1rem",
    position: "absolute",
    right: 20,
  },
  playButton: {
    background: "linear-gradient(45deg, #964B00 30%, #BC7434 80%)",
    border: 0,
    borderRadius: 50,
    color: "white",
    height: 45,
    padding: "0 15px",
    textTransform: "lowercase",
    fontSize: "1rem",
    position: "relative",
    right: 20,
  },
  music: {
    width: 200,
  },
});

const muiTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: "#c27b48",
      },
      track: {
        color: "#c27b48",
      },
      rail: {
        color: "#cccbca",
      },
    },
  },
});

const Footer = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.isPlaying ? (
        <Button
          variant="contained"
          onClick={props.pause}
          className={classes.playButton}
        >
          Pause
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={props.play}
          className={classes.playButton}
        >
          Play
        </Button>
      )}
      <div className={classes.music}>
        <Grid container spacing={1}>
          <Grid item>
            <VolumeDown />
          </Grid>
          <Grid item xs>
            <ThemeProvider theme={muiTheme}>
              <Slider
                value={props.volume}
                step={10}
                min={0}
                max={100}
                onChange={props.handleChange}
              />
            </ThemeProvider>
          </Grid>
          <Grid item>
            <VolumeUp />
          </Grid>
        </Grid>
      </div>
      <Button
        className={classes.leaveButton}
        variant="contained"
        onClick={props.leave}
      >
        leave meeting
      </Button>
    </div>
  );
};

export default Footer;

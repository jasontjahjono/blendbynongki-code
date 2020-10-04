import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import io from "socket.io-client";
import Peer from "simple-peer";
import picnic_day from "../misc/picnic_day.png";
import picnic_night from "../misc/picnic_night.png";
import cafe_day from "../misc/cafe_day.png";
import cafe_night from "../misc/cafe_night.png";
import lounge_day from "../misc/lounge_day.png";
import lounge_night from "../misc/lounge_night.png";
import Footer from "./Footer";

const useStyles = makeStyles({
  root: {
    backgroundSize: "cover",
    display: "flex",
    height: "93vh",
    width: "100%",
    margin: "auto",
    flexWrap: "wrap",
  },
  grid: {
    height: "50%",
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    height: "80%",
    width: "45%",
    objectFit: "cover",
  },
  music: {
    width: 200,
  },
});

const Video = (props) => {
  const classes = useStyles();
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video className={classes.video} playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Room = (props) => {
  const classes = useStyles();
  const [peers, setPeers] = useState([]);
  let query = useQuery();
  let background;
  switch (query.get("scene")) {
    case "coffeeshop":
      background = query.get("time") === "day" ? cafe_day : cafe_night;
      break;
    case "picnic":
      background = query.get("time") === "day" ? picnic_day : picnic_night;
      break;
    case "lounge":
      background = query.get("time") === "day" ? lounge_day : lounge_night;
      break;
  }
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  const roomID = props.match.params.roomID;

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          console.log("user joined", payload.callerID);
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const leaveMeeting = () => {
    socketRef.current.disconnect();
    props.leave();
  };

  return (
    <>
      <div
        className={classes.root}
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className={classes.grid}>
          <video
            className={classes.video}
            muted
            ref={userVideo}
            autoPlay
            playsInline
          />
        </div>
        {peers.map((peer, index) => {
          return (
            <div className={classes.grid}>
              <Video key={index} peer={peer} />
            </div>
          );
        })}
      </div>
      <Footer
        volume={props.volume}
        handleChange={props.handleChange}
        leave={leaveMeeting}
        play={props.play}
        pause={props.pause}
        isPlaying={props.isPlaying}
      />
    </>
  );
};

export default Room;

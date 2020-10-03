import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import io from "socket.io-client";
import Peer from "simple-peer";
import picnic_bg from "../misc/picnic_bg.png";
import cafe_bg from "../misc/cafe.jpg";
import Footer from "../components/Footer";

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

  const background = query.get("scene") === "coffeeshop" ? cafe_bg : picnic_bg;

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

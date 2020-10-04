import React, { useState } from "react";
import Room from "../components/Room";
import cafe from "../misc/cafe.mp3";
import picnic from "../misc/picnic.mp3";
import lounge from "../misc/lounge.mp3";
import useSound from "use-sound";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AmbientRoom = (props) => {
  let query = useQuery();
  let music;
  switch (query.get("scene")) {
    case "coffeeshop":
      music = cafe;
      break;
    case "picnic":
      music = picnic;
      break;
    case "lounge":
      music = lounge;
      break;
  }

  const [volume, setVolume] = useState(0.5);
  const [play, { stop, pause, isPlaying }] = useSound(music, {
    volume,
    interrupt: true,
  });

  const handleChange = (e, newValue) => {
    setVolume(newValue / 100);
  };

  const playMusic = () => {
    play();
  };

  const pauseMusic = () => {
    pause();
  };

  const leave = () => {
    props.history.push("/");
    stop();
  };

  return (
    <Room
      {...props}
      volume={volume * 100}
      handleChange={handleChange}
      leave={leave}
      play={playMusic}
      pause={pauseMusic}
      isPlaying={isPlaying}
    />
  );
};

export default AmbientRoom;

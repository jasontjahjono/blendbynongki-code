import React, { useEffect, useState } from "react";
import Room from "./Room";
import music from "../misc/jazz_cafe.mp3";
import useSound from "use-sound";

const AmbientRoom = (props) => {
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

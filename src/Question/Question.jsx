import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useRef } from "react";
import YouTube from "react-youtube";
import Header from "/src/Header/Header";
import classes from "./Question.module.css";
import Footer from "../Footer/Footer";
import PlaySvg from "../assets/play.svg";
import PauseSvg from "../assets/pause.svg";
import Loader from "../Loader/Loader";
const Question = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const [quesArray, setQuesArray] = useState(location.state.quesArray);
  const [quesCount, setQuesCount] = useState(location.state.quesCount);
  const [currentCount, setCurrentCount] = useState(location.state.currentCount);
  const [score, setScore] = useState(location.state.score);
  const [player, setPlayer] = useState();
  const [isReady, setReady] = useState(false);
  const [playPauseImg, setPlayPauseImg] = useState(PlaySvg);
  const intervalRef = useRef(null);
  const [countdown,setCountdown] = useState(10) 

  const [multiplayer,setMultiplayer] = useState(location.state.multiplayer)
  const [scoreArray,setScoreArray] = useState(location.state.scoreArray)
  const [playerArray,setPlayerArray] = useState(location.state.playerArray)
  const [playerIndex,setPlayerIndex] = useState(location.state.playerIndex)
  // console.log(quesArray);
  // console.log(quesCount)
  // console.log(currentCount)
  // console.log(score)
  // console.log(multiplayer)
  // console.log(scoreArray)
  // console.log(playerArray)
  // console.log(playerIndex)
  const onReady = (event) => {
    setPlayer(event.target);
    setReady(true);
  };
  const toggle = () => {
    if (player.getPlayerState() != 1) {
      let mid = Math.floor(player.getDuration() / 2);
      player.unMute();
      player.setVolume(100);
      player.seekTo(mid - 5);
      player.playVideo();
      setPlayPauseImg(PauseSvg);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        // console.log("checking");
        // console.log ( Math.ceil((mid + 5)) - Math.ceil(player.getCurrentTime()) )
        setCountdown(Math.ceil((mid + 5)) - Math.ceil(player.getCurrentTime()))
        if (player.getCurrentTime() > mid + 4) {
          //   console.log("done");
          player.pauseVideo();
          setPlayPauseImg(PlaySvg);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 1000);
    } 
    // else {
    //   player.pauseVideo();
    //   setPlayPauseImg(PlaySvg);
    //   clearInterval(intervalRef.current);
    //   intervalRef.current = null;
    // }
  };

  //Clean up interval on component unmount
  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  const toValidate = (selectedId) => {
    // if (selectedId == quesArray[currentCount].id) {
    //   console.log("correct");
    // } else {
    //   console.log("wrong");
    // }

    navigate("/result", {
      state: { quesCount, quesArray, currentCount, selectedId, score,multiplayer,scoreArray,playerArray,playerIndex },
    });
  };
  return (
    <div className={classes.questionWrapper}>
      <Header></Header>
      <YouTube
        videoId={quesArray[currentCount].id}
        opts={opts}
        onReady={onReady}
      />
      {!isReady && (
        <div className={classes.loaderFlex}>
          <Loader></Loader>
        </div>
      )}
      {isReady &&
        (() => {
          return (
            <div className={classes.countdownFlex}>
              {multiplayer!=0 && <p>Player {playerIndex+1}</p>}
              <p>Time : {countdown}</p>
            <div className={classes.questionFlex}>
              <div className={classes.divLeft}>
                <div className={classes.blobContainer} onClick={toggle}>
                  <img
                    src={playPauseImg}
                    className={classes.playPng}
                    alt="play-pause"
                  ></img>
                  <div className={["tk-blob", classes.aniBlob].join(" ")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 440.7 428.7"
                    >
                      <path d="M410.6 78.8c36 52.5 36.1 126 19.2 194C412.9 340.7 379 403 330 421.9c-49 19-113.1-5.3-178.6-34C85.8 359.2 18.7 326.1 3.5 276.4-11.7 226.7 25 160.3 71.7 105.3 118.3 50.3 174.8 6.8 239 .7c64.1-6 135.7 25.5 171.6 78.1z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className={classes.divRight}>
                {quesArray[currentCount].answers.map((data, id) => {
                  return (
                    <div
                      className={classes.options}
                      key={data.id}
                      onClick={() => {
                        toValidate(data.id);
                      }}
                    >
                      <p>{data.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          );
        })()}
      <Footer></Footer>
    </div>
  );
};

export default Question;

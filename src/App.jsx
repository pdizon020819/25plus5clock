/* eslint-disable react-hooks/rules-of-hooks */
import "./App.css";
import React, { useState, useEffect } from "react";

// default values
const defaultSessionLength = 25;
const defaultBreakLength = 5;

function App() {
  const [sessionLength, setSessionLength] = useState(defaultSessionLength);
  const [breakLength, setBreakLength] = useState(defaultBreakLength);
  const [timeLeft, setTimeLeft] = useState(defaultSessionLength * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [lengthChanged, setLengthChanged] = useState(false);

  const handleLengthChange = (type, amount) => {
    if (!isPlaying) {
      if (type === "session") {
        setSessionLength((prev) => Math.min(Math.max(prev + amount, 1), 60));
      } else if (type === "break") {
        setBreakLength((prev) => Math.min(Math.max(prev + amount, 1), 60));
      }
      setLengthChanged(true); // Mark that a length change occurred
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      let beep = document.getElementById("beep");
      beep.play();

      setTimeout(() => {
        setIsSession((prevIsSession) => !prevIsSession);
        setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60); // Switch to break/session length
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, isSession, sessionLength, breakLength]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    // Sync timeLeft with sessionLength or breakLength when the timer is paused
    if (!isPlaying && lengthChanged) {
      setTimeLeft(isSession ? sessionLength * 60 : breakLength * 60);
    }
    setLengthChanged(false);
  }, [sessionLength, breakLength, isPlaying, isSession, lengthChanged]);

  const handleReset = () => {
    setSessionLength(defaultSessionLength);
    setBreakLength(defaultBreakLength);
    setTimeLeft(defaultSessionLength * 60);
    setIsSession(true);
    setIsPlaying(false);
    const beep = document.getElementById("beep");
    if (beep) {
      beep.pause(); // Stop the audio if it's playing
      beep.currentTime = 0; // Reset audio playback position
    }
  };

  return (
    <>
      <div className="main-body asldjk">
        {/* title */}
        <div className="title">
          <h3>Pomodoro Clock</h3>
        </div>
        {/* session/break timer settings */}
        <div className="timer-settings">
          {/* session */}
          <div className="setting-container">
            <p className="setting-label" id="session-label">
              Session Length
            </p>
            <div>
              <p className="setting-value" id="session-length">
                {sessionLength}
              </p>
              <div>
                <button
                  className="setting-button"
                  id="session-increment"
                  onClick={() => handleLengthChange("session", 1)}
                >
                  &#11165;
                </button>
                <button
                  className="setting-button"
                  id="session-decrement"
                  onClick={() => handleLengthChange("session", -1)}
                >
                  &#11167;
                </button>
              </div>
            </div>
          </div>

          {/* break */}
          <div className="setting-container">
            <p className="setting-label" id="break-label">
              Break Length
            </p>
            <div>
              <p className="setting-value" id="break-length">{breakLength}</p>
              <div>
                <button
                  className="setting-button"
                  id="break-increment"
                  onClick={() => handleLengthChange("break", 1)}
                >
                  &#11165;
                </button>
                <button
                  className="setting-button"
                  id="break-decrement"
                  onClick={() => handleLengthChange("break", -1)}
                >
                  &#11167;
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* countdown with the title of session or break to see what it is counting down */}
        <div className="countdown-container">
          <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
          <h1 className="countdown" id="time-left">{formatTime(timeLeft)}</h1>
          <audio id="beep">
            <source src="/arcade-beep.wav" type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
        {/* pause/play and reset buttons */}
        <div className="control-container">
          <div>
            <button className="control-button" id="start_stop" onClick={() => handlePlayPause()} title="start/stop">
              {isPlaying ? <span>&#x23F8;</span> : <span>&#11208;</span>}
            </button>
          </div>
          <div>
            <button className="control-button" id="reset" onClick={() => handleReset()} title="reset">
              &#11118;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

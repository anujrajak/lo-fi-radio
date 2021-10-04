import "./App.css";
import styled from "styled-components";
import { useState, useEffect } from "react";
import gifsData from "./data";
import stations from "./data/Stations";
import Player from "./components/Player";
// import StationList from "./components/StationList";

import { fetchQuote, suffleList } from './Utils/HelperFunctions';
import React from "react";

function App() {
  const [quote, setQuote] = useState();
  const [theme, setTheme] = useState(gifsData);
  const [currentTheme, setCurrentTheme] = useState();
  const [station, setStation] = useState();
  const [stationData, setStationData] = useState();
  const [volume, setVolume] = useState(50);
  const [isPlaying, setPLaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStation, setCurrentStation] = useState({
    name: "Lofi Girl",
    key: "5qap5aO4i9A",
  });

  useEffect(() => {
    fetchQuote().then(data => { setQuote(data.text); });
    setTheme(suffleList(gifsData));
    setCurrentTheme(theme[0]);
    setStationData(stations);
    // setStation(stations[0]);
  }, [theme]);

  /**
   * I'll explain later why i'm using this custom hook.
   * @param {function} callback
   * @param {in milliseconds} delay
   */
  const useInterval = (callback, delay) => {
    const savedCallback = React.useRef();

    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useInterval(() => {
    if (!theme[currentIndex]) {
      setCurrentIndex(0);
      setCurrentTheme(theme[0]);
      return;
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    setCurrentTheme(theme[currentIndex]);
  }, 10000);

  // const changeStation = (e) => {
  //   const value = e.target.value;
  //   const station = stations.find((obj) => {
  //     return obj.key === value;
  //   });
  //   setCurrentStation(station);
  //   setStation(station);
  // };

  const playNext = function () {
    let stationIndex = stationData.findIndex(st => currentStation.name === st.name);
    ++stationIndex;
    if (stationData.length <= stationIndex) {
      stationIndex = 0
    }
    setCurrentStation(stationData[stationIndex]);
    if (isPlaying) {
      setStation(stationData[stationIndex]);
    }
  };

  const playPrev = function() {
    let stationIndex = stationData.findIndex(st => currentStation.name === st.name);
    --stationIndex;
    if (stationIndex < 0) {
      stationIndex = stationData.length - 1;
    }
    setCurrentStation(stationData[stationIndex]);
    if (isPlaying) {
      setStation(stationData[stationIndex]);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      setStation(currentStation);
    } else {
      setStation();
    }
  }, [isPlaying, currentStation]);

  const playVideo = (control) => {
    setPLaying(control === 'play' ? true : false);
  }

  const changeVolume = (type) => {
      if (volume !== 100 && type === "inc") {
        setVolume(volume+10)
      } else if (volume !== 0 && type === "dec") {
        setVolume(volume-10)
      } else {
        setVolume(0)
      }
  }

  return (
    <>
      <Player station={station} volume={volume}/>
      <div className="app" unselectable="on">
        <Main>
          <img src={`assets/${currentTheme}`} alt="" />
          {/* <img src={`assets/bridge-day.gif`} alt="" /> */}
        </Main>
        <Section>
          {/* <span>
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 5H4v2h16v-2z" fill="currentColor"/> </svg>
          </span> */}
          <div id='radioContent'>
            <p id="heading">Lo-Fi Radio</p>
            <p id="quote">{quote}</p>
            <p id="quote">
              <span style={{ fontSize: '13px' }}>
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 30 30"> <path d="M2 20h20V6h-7V4h-2v2h-2V4H9v2H2v14zM9 4V2H7v2h2zm6 0h2V2h-2v2zm5 4v10H4V8h16z" fill="currentColor" /> </svg>
                {currentStation.name}
              </span>
            </p>
            <p style={{ textTransform: "uppercase" }}>
              <span>
                <span onClick={playPrev}>
                  <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 4h2v16H6V4zm12 0h-2v2h-2v3h-2v2h-2v2h2v3h2v2h2v2h2V4z" fill="currentColor" /> </svg>
                </span>

                {!isPlaying && <span onClick={() => { playVideo('play') }}><svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z" fill="currentColor" /> </svg></span>}

                {isPlaying && <span onClick={() => { playVideo('pause') }}><svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M10 4H5v16h5V4zm9 0h-5v16h5V4z" fill="currentColor" /> </svg></span>}
                <span onClick={playNext}>
                  <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 4h2v2h2v2h2v2h2v4h-2v2h-2v2H8v2H6V4zm12 0h-2v16h2V4z" fill="currentColor" /> </svg>
                </span>
                <span>
                <span onClick={()=> {changeVolume('dec')}}>-</span>
                <span onClick={()=> {changeVolume('mute')}}>{volume?"Mute":"Unmute"}</span>
                <span onClick={()=> {changeVolume('inc')}}>+</span>
                </span>

              </span>
            </p>
            {/* {!isPlaying && <button onClick={playVideo}>PLAY</button>} */}
            {/* {station && station.key && <select name="cars" id="cars" onChange={changeStation}>
              {stations &&
                stationData.map((station) => {
                  return (
                    <option
                      className="opt"
                      value={station.key}
                      key={stations.indexOf(station)}
                    >
                      {station.name}
                    </option>
                  );
                })}
            </select> } */}
          </div>
        </Section>
        {/* <StationList stationData={stationData} /> */}
        <Footer className="footer">
          <span onClick={() => { setShowInfo(!showInfo) }}>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h2v18H3V3zm16 0H5v2h14v14H5v2h16V3h-2zm-8 6h2V7h-2v2zm2 8h-2v-6h2v6z" fill="currentColor"/> </svg>
          </span>
          {showInfo && <ul>
            <li>
              <a href="http://anujrajak.github.io/" target="_blank" rel="noopener noreferrer">
                Me
              </a>
            </li>
            <li>
              <a href="https://github.com/anujrajak" target="_blank" rel="noopener noreferrer">
                Github
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/lofiradioapp/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="mailto:mr.anujrajak@gmail.com" target="_blank" rel="noopener noreferrer">
                Mail
              </a>
            </li>
          </ul>}
        </Footer>
      </div>
    </>
  );
}

export default App;

const Main = styled.div`
  width: 100%;
  height: 100vh;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: brightness(70%);
  }
`;

const Section = styled.div`
  span {
    position: absolute;
    top: 15px;
    right: 15px;

    svg {
      width: 40px;
      color: #f5f5f5;
      filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 1));
    }
  }

  div#radioContent {
    padding: 1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 80%;

    p {
      color: #f5f5f5;
      text-shadow: 2px 2px 0 #020406;

      span {
        position: inherit;
        margin: 0 20px;
      }
    }

    div#listStaion {
      position: relative;
    }

    p#heading {
      font-size: max(3vw, 40px);
      color: #f5f5f5;
      text-shadow: 5px 5px 0 #020406;
      margin-bottom: 10px;
    }

    p#quote {
      line-height: 15px;
    }

    button {
      border: none;
      font-family: "Press Start 2P";
      font-weight: bold;
      background: rgb(255 255 255 / 20%);
      height: 30px;
      border-radius: 5px;
      letter-spacing: 3px;
      color: #f5f5f5;
      text-shadow: 2px 2px 0 #020406;
      width: 150px;
    }

    select {
      font-family: "Press Start 2P";
      width: 262px;
      height: 40px;
      padding: 5px;
      line-height: 35px;
      cursor: pointer;
      box-shadow: 5px 5px 0 #020406;
    }

    select option {
      margin: 40px;
      background: rgba(0, 0, 0, 0.3);
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
    }
  }
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
  align-items: center;

  font-size: 10px;
  text-transform: capitalize;

  span {
    width: 40px;
    color: #f5f5f5;
    -webkit-filter: drop-shadow(2px 2px 0px rgba(0,0,0,1));
    filter: drop-shadow(2px 2px 0px rgba(0,0,0,1));
  }
`;

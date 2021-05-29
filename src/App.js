import "./App.css";
import styled from "styled-components";
import { useState, useEffect } from "react";
import gifsData from "./data";
import stations from "./data/Stations";
import Player from "./components/Player";

import { fetchQuote, suffleList } from './Utils/HelperFunctions';
import React from "react";


function App() {
  const [quote, setQuote] = useState();
  const [theme, setTheme] = useState(gifsData);
  const [currentTheme, setCurrentTheme] = useState();
  const [station, setStation] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchQuote().then(data => { setQuote(data.text); });
    setTheme(suffleList(gifsData));
    setCurrentTheme(theme[0]);
    setStation(stations[0]);
  }, []);

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
    setCurrentTheme(theme[currentIndex]);
    if (theme.length === currentIndex) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex+1)
    }
  }, 6000);

  const changeStation = (e) => {
    const value = e.target.value;
    const station = stations.find((obj) => {
      return obj.key === value;
    });

    setStation(station);
  };

  return (
    <>
      <Player station={station} />
      <div className="app">
        <Main>
          <img src={`./lo-fi-radio/assets/${currentTheme}`} alt="" />
          {/* <img src={`assets/comition_sky_left_to_right.gif`} alt="" /> */}
        </Main>
        <Section>
          {/* <span>
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 5H4v2h16v-2z" fill="currentColor"/> </svg>
          </span> */}
          <div>
            <p id="heading">Lo-Fi Radio</p>
            <p id="quote">{quote}</p>
            {/* <p style={{ textTransform: "uppercase" }}>{station.name}</p> */}
            <select name="cars" id="cars" onChange={changeStation}>
              {stations &&
                stations.map((station) => {
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
            </select>
          </div>
        </Section>
        <Footer className="footer">
          <span>

          </span>
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
    }
  }

  div {
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
    }

    p#heading {
      font-size: max(3vw, 40px);
      color: #f5f5f5;
      text-shadow: 5px 5px 0 #020406;
      margin-bottom: 10px;
    }

    p#quote {
      line-height: 20px;
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
  justify-content: space-between;
  width: 100%;
  padding: 10px;
`;

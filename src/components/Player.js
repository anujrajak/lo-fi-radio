import React from 'react';
import YouTube from 'react-youtube';

function Player({ station }) {

  const opts = {
    vq: 'tiny',
    width: 10,
    height: 10,
    playerVars: {
      autoplay: 1,
      'origin': 'http://localhost:3000'
    }
  };
  const _onReady = (event) => {
    event.target.playVideo();
  }

  return (
      <div>
        {station && <YouTube videoId={station.key} opts={opts} onReady={_onReady} style={{ display: 'none'}} />}
      </div>
  )
}

export default Player

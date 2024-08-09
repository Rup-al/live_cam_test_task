import React from 'react';

const VideoDisplay = ({ live_url }) => (
  <div>
    <h1>Live Video</h1>
    <iframe src={live_url} width="640" height="480" frameBorder="0" allowFullScreen></iframe>
  </div>
);

export default VideoDisplay;

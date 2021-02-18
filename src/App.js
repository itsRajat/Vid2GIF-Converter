import './App.css';
import React, { useState, useEffect } from 'react';
import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [statusText, setStatusText] = useState(
    'Please choose a video file & hit the Convert button!'
  );

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '10',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif'
    );

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' })
    );

    document.querySelector('.upload').remove();

    setGif(url);
    setStatusText(
      'Video converted to GIF successfully! To convert another, press CTRL + F5.'
    );
  };

  return ready ? (
    <div className="App">
      <h1>Vid2GIF Converter</h1>
      <h3>DEVELOPED BY RAJAT KAUSHIK</h3>

      <div className="container">
        <div className="upload">
          {video && (
            <video
              controls
              width="250"
              src={URL.createObjectURL(video)}
              style={{
                visibility: `${gif ? 'hidden' : 'visible'}`,
              }}
            ></video>
          )}

          <input
            style={{
              visibility: `${gif ? 'hidden' : 'visible'}`,
            }}
            type="file"
            onChange={(e) => setVideo(e.target.files?.item(0))}
          />
        </div>
        <button
          onClick={convertToGif}
          style={{
            visibility: `${gif ? 'hidden' : 'visible'}`,
          }}
        >
          Convert
        </button>
      </div>
      <div className="result">
        {gif && <img src={gif} width="250" alt="Result: Your converted GIF!" />}
      </div>
      <h2 style={{ fontSize: '20px', textAlign: 'center', padding: '10px' }}>
        {statusText}
      </h2>
    </div>
  ) : (
    <p>Loading the web app, please wait...</p>
  );
}

export default App;

import { useState } from 'react';
import './App.css'

const audioCTX = new window.AudioContext();
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true
});
const gain = new GainNode(audioCTX, { gain: 2 });
const feedback = new GainNode(audioCTX, { gain: 0.8 });
const delay = new DelayNode(audioCTX, { delayTime: 0.75 });
const destination = audioCTX.destination;
const createStream = audioCTX.createMediaStreamSource(stream);


createStream.connect(gain);
gain.connect(delay);
delay.connect(feedback);
feedback.connect(delay);
delay.connect(destination);

const App = () => {
    const [ delayTime, setDelayTime ] = useState(delay.delayTime.value);

    const delayHandler = (e) => {
      setDelayTime(e.target.value);
      delay.delayTime.value = delayTime;
    }
    
    return (
      <div className="App">
        <button className='record' onClick={() => audioCTX.resume()}>
          Start
        </button>

        <div className="control">
        <h3>Delay control</h3>
        <input 
          type="range" 
          id='delay' 
          min={0.001} 
          max={1} 
          step={0.001} 
          value={delayTime} 
          onChange={delayHandler}
          />
          <h4>{delayTime}</h4>
        </div>
      </div>
    )
}

export default App

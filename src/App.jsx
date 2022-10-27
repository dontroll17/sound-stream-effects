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

const lfo = new OscillatorNode(audioCTX, { frequency: 5 });
const lfoGain = new GainNode(audioCTX, { gain: 0 });


createStream.connect(gain);
gain.connect(delay);

lfo.connect(lfoGain).connect(delay);

delay.connect(feedback);
feedback.connect(delay);
delay.connect(destination);

const App = () => {
    const [ delayTime, setDelayTime ] = useState(delay.delayTime.value);
    const [ lfoGainVal, setlfoGainVal ] = useState(lfoGain.gain.value);
    const [ lfofreq, setLfoFreq ] = useState(lfo.frequency.value);

    const delayUpdater = (e) => {
      setDelayTime(e.target.value);
      delay.delayTime.value = delayTime;
    }

    const lfoGainUpdater = (e) => {
      setlfoGainVal(e.target.value);
      lfoGain.gain.value = lfoGainVal;
    }

    const updateLfoFreq = (e) => {
      setLfoFreq(e.target.value);
      lfo.frequency.value = lfofreq;
    }
    
    return (
      <div className="App">
        <button className='record' onClick={() => lfo.start()}>
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
            onChange={delayUpdater}
          />
          <h4>{delayTime}</h4>
        </div>

        <div className="control">
          <h3>LFO control</h3>
          <input 
            type="range" 
            id='lfoGain' 
            min={0} 
            max={0.2} 
            step={0.0001} 
            value={lfoGainVal} 
            onChange={lfoGainUpdater}
          />
          <h4>{lfoGainVal} LFO Gain value</h4>
        </div>

        <div className="control">
          <input 
            type="range" 
            id='lfoFreq' 
            min={0} 
            max={8} 
            step={0.001} 
            value={lfofreq} 
            onChange={updateLfoFreq}
          />
          <h4>{lfofreq} LFO Frequency</h4>
        </div>
      </div>
    )
}

export default App

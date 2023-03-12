import "./App.css"
import { useEffect, useState } from "react"
// import SpeechToText from "./speach"

function App() {

  const speechHandler = () => {
    const utterance = new SpeechSynthesisUtterance(requstInUser.en);
    console.log(requstInUser)
    window.speechSynthesis.speak(utterance);
  }
  
  const recognitionSupported =
  "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
const [transcript, setTranscript] = useState("");
const [recognizing, setRecognizing] = useState(false);
const [recognition, setRecognition] = useState(null);
const [requstInUser, setRequstInUser] = useState({})

useEffect(() => {
  if (!recognition && recognitionSupported) {
    setRecognition(
      new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    );
  }
  if (!recognition) {
    return;
  }
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    setTranscript(event.results[0][0].transcript);
  };

  recognition.onend = () => {
    setRecognizing(false);
  };
}, [recognition, recognitionSupported]);


const handleStart = () => {
  if (!recognition) {
    return;
  }
  setTranscript("");
  setRecognizing(true);
  recognition.start();
};

const handleStop = () => {
  if (!recognition) {
    return;
  }
  recognition.stop();
};


const handleSend = (transcript) => {
  fetch('http://localhost:8000/', {
method: 'POST', 
headers: {
  'Content-Type': 'application/json',
},
body: JSON.stringify({request_for_catGPT:transcript}),
})
.then((response) => response.json())
.then((data) => {
  setRequstInUser(data)
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
};

  return (
    <div className='App'>
            <h1>Recording a question to ChatGPT and receiving a recorded answer</h1>
            {!recognitionSupported && <p>Speech recognition is not supported.</p>}
      {!recognizing && recognitionSupported && (
        <button className="button-19"  onClick={handleStart}>Start recording</button>
      )}
      {recognizing && recognitionSupported && (
        <button className="button-19"  onClick={handleStop}>Stop recording</button>
      )}
      <button className="button-19"  onClick={()=>{handleSend(transcript)}}>Send to ChatGPT</button>
      <p>{transcript}</p>
      
      {/* <SpeechToText/> */}
      <h2>Hebrow    |-----------------|    English</h2>
      <textarea rows="10" cols="50"
        value={requstInUser ?.he}
        disabled={true}
      />
       <textarea rows="10" cols="50"
        value={requstInUser?.en}
        disabled={true}
      />
      <div>

      <button className="button-19"  onClick={speechHandler}>SPEAK result</button>
      </div>
          </div>
  )
}

export default App

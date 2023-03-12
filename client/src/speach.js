import React, { useState, useEffect } from "react";

const SpeechToText = () => {
  const recognitionSupported =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  const [transcript, setTranscript] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
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
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({data:transcript}),
})
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  };

  return (
    <div>
      {!recognitionSupported && <p>Speech recognition is not supported.</p>}
      {!recognizing && recognitionSupported && (
        <button onClick={handleStart}>Start recording</button>
      )}
      {recognizing && recognitionSupported && (
        <button onClick={handleStop}>Stop recording</button>
      )}
      <button onClick={()=>{handleSend(transcript)}}>Send</button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechToText;

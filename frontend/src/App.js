import React, { useState, useEffect } from 'react';
import './App.css';

function App () {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/message')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Frontend</h1>
        <p><strong>Message from Spring Boot:</strong> {message}</p>
      </header>
    </div>
  );
}

export default App;
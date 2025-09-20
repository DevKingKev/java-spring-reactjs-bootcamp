import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/message')
      .then((res: Response) => res.text())
      .then((data: string) => setMessage(data))
      .catch((err: Error) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Frontend</h1>
        <p><strong>Message from Spring Boot:</strong> {message}</p>
      </header>
    </div>
  );
};

export default App;
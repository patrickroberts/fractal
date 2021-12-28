import { useEffect } from 'react';
import worker from './example';

const exampleWorker = worker();

function App() {
  useEffect(() => {
    (async () => {
      console.log(await exampleWorker.expensive(1000));
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

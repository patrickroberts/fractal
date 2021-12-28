import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const worker = new Worker(new URL('./example.worker.ts', import.meta.url));

    worker.postMessage(1000);
    worker.addEventListener('message', (event: MessageEvent<number>) => {
      console.log(event.data);
    });

    return () => {
      worker.terminate();
    };
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

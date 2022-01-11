import './App.css';

import type { Complex } from 'complex-js';
import { cartesian, compile } from 'complex-js';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import type Fractal from './fractal.rpc';
import type { RenderOptions } from './fractal.worker';
import FractalPool from './components/FractalPool';
import useAutoSize from './hooks/useAutoSize';
import useSetupOptions from './hooks/useSetupOptions';
import { assert } from './types/SetupOptions';

const App = () => {
  const pool = useRef<Fractal[]>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const textarea = useAutoSize();
  const [state, setState] = useSetupOptions();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(JSON.stringify(state, null, 2));

    const workers = pool.current!;
    const context = canvas.current!.getContext('2d')!;
    const { width, height } = state;
    let cancel = false;

    Promise.all(
      workers.map(worker => worker.setup(state)),
    ).then(async () => {
      const idle = workers.slice();
      const busy = new Set<Promise<void>>();
      const compute = (options: RenderOptions) => {
        const worker = idle.pop()!;
        let thread!: Promise<void>;

        thread = worker.render(options).then(imageData => {
          if (cancel) {
            return;
          }

          const { x, y } = options;

          context.putImageData(imageData, x, y);
          idle.push(worker);
          busy.delete(thread);
        });

        busy.add(thread);
      };

      for (let y = 0; y < height; ++y) {
        for (let index = 0; index < workers.length; ++index) {
          if (idle.length === 0) {
            await Promise.race(busy);

            if (cancel) {
              return;
            }
          }

          const x = Math.floor(width * index / workers.length);
          const length = Math.floor(width * (index + 1) / workers.length) - x;

          compute({ length, x, y });
        }
      }

      return Promise.all(busy);
    }).catch(({ message }) => {
      setError(message);
    });

    return () => {
      cancel = true;
      context.clearRect(0, 0, width, height);
    };
  }, [state]);

  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  const load = () => {
    try {
      setState(assert(JSON.parse(value)));
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };
  const copy = async ({ nativeEvent: { offsetX, offsetY }}: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { width, height, zoom, center } = state;
    const { real, imag } = compile(center)() as Complex;
    const z = cartesian(
      real + (offsetX - width / 2) / zoom,
      imag + (offsetY - height / 2) / zoom,
    );

    await navigator.clipboard.writeText(z.toString());
  };

  return (
    <>
      <FractalPool ref={pool} />
      <div>
        <textarea ref={textarea} value={value} onChange={change} />
      </div>
      <div>
        <button onClick={load}>Load</button>
      </div>
      <div className="error">
        {error}
      </div>
      <div>
        <canvas ref={canvas} width={state.width} height={state.height} onClick={copy} />
      </div>
    </>
  );
};

export default App;

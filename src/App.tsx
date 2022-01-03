import './App.css';

import type { Complex } from 'complex-js';
import { cartesian, compile } from 'complex-js';
import type React from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type Fractal from './fractal.rpc';
import type { SetupOptions, RenderOptions } from './fractal.worker';
import FractalPool from './components/FractalPool';

const initialState = {
  width: 768,
  height: 432,
  zoom: 224,
  center: '0',
  c: '-0.8+0.156*i',
  iterate: 'z**2+c',
  iterations: 512,
  escape: 2,
  potential: 'log(log(abs(z))/log(N))/log(2)+N/2',
};

const unused = (_: unknown) => {};

const App = () => {
  const pool = useRef<Fractal[]>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState<SetupOptions>(initialState);
  const [value, setValue] = useState(() => JSON.stringify(state, null, 2));
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    unused(value);
    const element = textarea.current!;

    element.style.width = 'auto';
    element.style.height = 'auto';

    element.style.width = `${element.scrollWidth}px`;
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  useEffect(() => {
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

        thread = worker.render(options).then((pixels) => {
          if (cancel) {
            return;
          }

          const data = new Uint8ClampedArray(pixels.buffer);
          const { length, x, y } = options;

          context.putImageData(new ImageData(data, length, 1), x, y);
          idle.push(worker);
          busy.delete(thread);
        });

        busy.add(thread);
      };

      for (let y = 0; y < height; ++y) {
        for (let index = 0; index < workers.length; ++index) {
          if (idle.length === 0) {
            await Promise.race(busy);
          }

          if (cancel) {
            return;
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
  }, [state, setError]);

  const copyCoordinate = async ({ nativeEvent: { offsetX, offsetY }}: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { width, height, zoom, center } = state;
    const { real, imag } = compile(center)() as Complex;
    const z = cartesian(
      real + (offsetX - width / 2) / zoom,
      imag + (offsetY - height / 2) / zoom,
    );

    await navigator.clipboard.writeText(z.toString());
  };
  const load = () => {
    try {
      setState(JSON.parse(value));
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };
  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  const { width, height } = state;

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
        <canvas ref={canvas} width={width} height={height} onClick={copyCoordinate} />
      </div>
    </>
  );
};

export default App;

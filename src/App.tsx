import { useEffect, useRef } from 'react';
import FractalPool from './components/FractalPool';
import type Fractal from './fractal.rpc';

const size = 768;

const App = () => {
  const pool = useRef<Fractal[]>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvas.current!.getContext('2d')!;
    let cancel = false;

    (async () => {
      const workers = pool.current!;

      await Promise.all(workers.map(worker => worker.setup({
        expression: 'z**2+c',
        potential: 'log(log(abs(z))/log(N))/log(2)',
        center: '-0.625',
      })));

      const array = new Uint32Array(size);
      const data = new Uint8ClampedArray(array.buffer);

      for (let dy = 0; dy < size; ++dy) {
        await Promise.all(workers.map(async (worker, index, { length }) => {
          const offset = Math.floor(array.length * index / length);
          const pixels = await worker.render({
            length: Math.floor(array.length * (index + 1) / length) - offset,
            dx: offset,
            dy,
            width: size,
            height: size,
            density: size / 3,
            escape: 5,
            iterations: 128,
          });

          array.set(pixels, offset);
        }));

        if (cancel) return;

        context.putImageData(new ImageData(data, size, 1), 0, dy);
      }
    })();

    return () => {
      cancel = true;
      context.clearRect(0, 0, size, size);
    }
  }, []);

  return (
    <>
      <FractalPool ref={pool} />
      <canvas ref={canvas} width={size} height={size} />
    </>
  );
};

export default App;

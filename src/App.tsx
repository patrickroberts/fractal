import { useEffect, useRef } from 'react';
import FractalPool from './components/FractalPool';
import type Fractal from './fractal.rpc';

const size = 384;

const App = () => {
  const pool = useRef<Fractal[]>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      const workers = pool.current!;

      await Promise.all(workers.map(worker => worker.setup({
        expression: 'z**2+c',
        potential: 'log(log(abs(z))/log(N))/log(2)',
        center: '-0.5',
      })));

      const context = canvas.current!.getContext('2d')!;

      for (let dy = 0; dy < size; ++dy) {
        const data = new Uint32Array(size);

        await Promise.all(workers.map(async (worker, index, { length }) => {
          const offset = Math.floor(index * data.length / length);
          const pixels = await worker.render({
            length: Math.floor((index + 1) * data.length / length) - offset,
            dx: offset,
            dy,
            width: size,
            height: size,
            density: size / 4,
            escape: 5,
            iterations: 256,
          });

          data.set(pixels, offset);
        }));

        context.putImageData(new ImageData(new Uint8ClampedArray(data.buffer), size, 1), 0, dy);
      }
    })();
  }, []);

  return (
    <>
      <FractalPool ref={pool} />
      <canvas ref={canvas} width={size} height={size} />
    </>
  );
};

export default App;

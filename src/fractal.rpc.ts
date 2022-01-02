import * as fractal from './fractal.worker';
import { Remote, expose } from './rpc';

expose(fractal, { render: pixels => [pixels.buffer] });

type Fractal = Remote<typeof fractal>;

export default Fractal;

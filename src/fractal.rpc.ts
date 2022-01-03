import * as fractal from './fractal.worker';
import type { Remote } from './rpc';
import { expose } from './rpc';

expose(fractal, { render: imageData => [imageData.data.buffer] });

type Fractal = Remote<typeof fractal>;

export default Fractal;

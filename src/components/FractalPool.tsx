import type Fractal from '../fractal.rpc';
import withPool from '../hocs/withPool';
import withWorker from '../hocs/withWorker';

const FractalPool = withPool(
  withWorker<Fractal>(
    () => new Worker(new URL('../fractal.rpc', import.meta.url)),
  ),
);

export default FractalPool;

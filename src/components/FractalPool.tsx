import withWorker from '../hocs/withWorker';
import withPool from '../hocs/withPool';
import type Fractal from '../fractal.rpc';

const FractalPool = withPool(
  withWorker<Fractal>(
    () => new Worker(new URL('../fractal.rpc', import.meta.url)),
  ),
);

export default FractalPool;

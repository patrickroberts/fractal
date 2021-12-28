// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./worker';
import * as example from './worker';

const factory = () => worker<typeof example>();

export default factory;

import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';

render(
  <StrictMode children={<App />} />,
  document.querySelector('#root'),
);

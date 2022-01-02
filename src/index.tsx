import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(
  <React.StrictMode children={<App />} />,
  document.querySelector('#root'),
);

import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';

const Wrapper = () => (
  <div className="wrapper">
    <Popup />
  </div>
);

render(<Wrapper />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();

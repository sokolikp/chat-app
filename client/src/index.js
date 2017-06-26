import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

// components
import App from './app/app';
// styles
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {store} from './store';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 

const render = () => ReactDOM.render(<App />, document.getElementById('root'));

render()

store.subscribe(render)
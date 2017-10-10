'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Report from './components/report.jsx';

const App = () => (
    <MuiThemeProvider>
        <Report data={data} />
    </MuiThemeProvider>
);

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <App data={data}/>, // data from global variable
        document.getElementById('root')
    );
});

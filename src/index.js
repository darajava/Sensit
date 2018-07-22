import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './App';

const startApp = () => {
    const rootEl = document.getElementById('root');

    ReactDOM.render(
        <AppContainer>
            <App />
        </AppContainer>,
      rootEl
    );

    if (module.hot) {
        module.hot.accept('./App', () => {
            const NextApp = require('./App').default; // eslint-disable-line global-require
            ReactDOM.render(
                <AppContainer>
                    <NextApp />
                </AppContainer>,
                rootEl
            );
        });
    }
};

if (window.cordova) {
    document.addEventListener('deviceready', () => {
        alert(4)
        startApp();
        alert(5)
    }, false);
} else {
    startApp();
}

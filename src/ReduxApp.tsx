import App from '#src/App';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '#src/Redux/Store';
import '#src/index.css';

export function ReduxApp(props: {}) {
   return (
    <React.StrictMode>
      <Provider store={store}>
        <div className="max-w-screen-lg mr-auto ml-auto relative min-h-screen">
          <App />
        </div>
    </Provider>
  </React.StrictMode>
  );
}
export default ReduxApp

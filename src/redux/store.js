import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import rootReducer from './modules';

export default (initialState, history) => {
  const middleware = [thunk, routerMiddleware(history)];
  let devTool;

  if (__DEV__) {
    middleware.push(createLogger());
    // noinspection JSUnresolvedVariable
    if (typeof window === 'object' && typeof window.devToolsExtension !== 'undefined') {
      // noinspection JSUnresolvedFunction
      devTool = window.devToolsExtension();
    }
  }
  const store = createStore(rootReducer, initialState,
    devTool ? compose(applyMiddleware(...middleware), devTool, f => f)
      : compose(applyMiddleware(...middleware), f => f));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./modules', () => {
      const nextRootReducer = require('./modules').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

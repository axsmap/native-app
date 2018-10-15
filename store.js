import { AsyncStorage } from 'react-native';
import {
  createNetworkMiddleware,
  networkEventsListenerSaga,
  reducer as networkReducer,
  offlineActionTypes
} from 'react-native-offline';
import Reactotron from 'reactotron-react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistCombineReducers, persistStore } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { appReducer, appSaga } from './modules/app';
import config from './config';
import { checkConnection } from './misc/helpers';

function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(networkEventsListenerSaga, {
      checkConnectionInterval: 10000,
      pingServerUrl: `${config.apiUrl}/ping`,
      timeout: 3000
    })
  ]);
}

export default function configureStore(callback) {
  const reducer = persistCombineReducers(
    {
      key: 'werta',
      storage: AsyncStorage,
      transforms: [createBlacklistFilter('app', ['isConnected', 'isSending'])]
    },
    {
      app: appReducer,
      network: networkReducer
    }
  );

  const networkMiddleware = createNetworkMiddleware({
    regexActionType: /REQUEST$/
  });

  let store;
  let sagaMiddleware;
  if (config.env === 'dev') {
    const sagaMonitor = Reactotron.createSagaMonitor();
    sagaMiddleware = createSagaMiddleware({ sagaMonitor });

    store = Reactotron.createStore(
      reducer,
      compose(applyMiddleware(networkMiddleware, sagaMiddleware))
    );
  } else {
    sagaMiddleware = createSagaMiddleware();

    store = createStore(
      reducer,
      compose(applyMiddleware(networkMiddleware, sagaMiddleware))
    );
  }

  sagaMiddleware.run(rootSaga);

  persistStore(store, null, () => {
    checkConnection().then(isConnected => {
      store.dispatch({
        type: offlineActionTypes.CONNECTION_CHANGE,
        payload: isConnected
      });
      callback();
    });
  });

  return store;
}

import jwtDecode from 'jwt-decode';
import { AsyncStorage } from 'react-native';
import { call, put, takeLatest } from 'redux-saga/effects';
import { offlineActionTypes } from 'react-native-offline';
import { createSelector } from 'reselect';

import { checkConnection } from '..//misc/helpers';
import { getProfileEndpoint } from '../endpoints/users';

// Actions constants
const GET_PROFILE = 'native-app/app/GET_PROFILE';
const SET_IS_SENDING = 'native-app/app/SET_IS_SENDING';
const SET_PROFILE = 'native-app/app/SET_PROFILE';

// Actions creators
export function getProfile(navigate) {
  return { type: GET_PROFILE, payload: { navigate } };
}

export function setIsSending(isSending) {
  return { type: SET_IS_SENDING, payload: { isSending } };
}

export function setProfile(profile) {
  return { type: SET_PROFILE, payload: { profile } };
}

// Reducer
const initialState = {
  isConnected: true,
  isSending: false,
  profile: {}
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case offlineActionTypes.CONNECTION_CHANGE:
      return { ...state, isConnected: action.payload };

    case SET_IS_SENDING:
      return { ...state, isSending: action.payload.isSending };

    case SET_PROFILE:
      return { ...state, profile: action.payload.profile };

    default:
      return state;
  }
}

// Selector
export function appSelector(attribute) {
  return createSelector(state => state.app, state => state[attribute]);
}

// Sagas
function* clearState() {
  yield call(AsyncStorage.removeItem, 'refreshToken');
  yield call(AsyncStorage.removeItem, 'token');
  yield put(setProfile({}));
}

function* getProfileFlow({ payload }) {
  const isConnected = yield call(checkConnection);

  const token = yield call(AsyncStorage.getItem, 'token');
  if (!token) {
    yield clearState();
    payload.navigate('SignIn');
    return;
  }

  let decodedData;
  try {
    decodedData = jwtDecode(token);
  } catch (error) {
    yield clearState();
    payload.navigate('SignIn');
    return;
  }

  const currentDate = new Date();
  const currentTime = currentDate.getTime();

  if (currentTime <= decodedData.exp) {
    yield clearState();
    payload.navigate('SignIn');
    return;
  }

  let response;
  if (isConnected) {
    try {
      response = yield call(getProfileEndpoint);
    } catch (error) {
      yield clearState();
      payload.navigate('SignIn');
      return;
    }

    const profile = {
      id: response.data.id,
      fullName: response.data.fullName,
      photo: response.data.photo,
      roles: response.data.roles
    };
    yield put(setProfile(profile));
  }

  payload.navigate('Venues');
}

export function* appSaga() {
  yield takeLatest(GET_PROFILE, getProfileFlow);
}

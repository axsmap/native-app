import axios from 'axios';
import { AsyncStorage } from 'react-native';

import env from '../env';

export default (async function handleEndpoint({
  method,
  headers,
  url,
  data,
  params,
  sourceToken
}) {
  const token = await AsyncStorage.getItem('token');

  let response;
  try {
    response = await axios({
      method,
      headers: {
        ...headers,
        Authorization: `Bearer ${token || ''}`
      },
      responseType: 'json',
      url: url.startsWith('/') ? `${env.apiUrl}${url}` : url,
      data,
      params,
      // timeout: 10000,
      cancelToken: sourceToken
    });
  } catch (err) {
    throw err;
  }
  return response;
});

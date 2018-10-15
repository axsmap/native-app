import Reactotron, {
  asyncStorage,
  networking,
  openInEditor,
  trackGlobalErrors
} from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import reactotronReduxSaga from 'reactotron-redux-saga';

import config from './config';

export default Reactotron.configure({ host: config.host })
  .useReactNative()
  .use(asyncStorage())
  .use(networking())
  .use(openInEditor())
  .use(trackGlobalErrors())
  .use(reactotronRedux())
  .use(reactotronReduxSaga())
  .connect();

import Expo, { AppLoading, Asset } from 'expo';
import React from 'react';
import { I18nextProvider, translate } from 'react-i18next';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { verticalScale } from 'react-native-size-matters';
import { Provider } from 'react-redux';

import config from './config';
import i18n from './i18n';
import Loading from './screens/Loading';
import SignIn from './screens/SignIn';
import configureStore from './store';
import { baseFontSize, colors, fonts } from './misc/styles';

if (config.env === 'dev') {
  require('./reactotron-config');
}

const AuthStack = createStackNavigator(
  { SignIn },
  {
    navigationOptions: {
      headerStyle: {
        height: verticalScale(baseFontSize * 4),
        backgroundColor: colors.primary
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontFamily: fonts.bold,
        fontSize: verticalScale(baseFontSize),
        fontWeight: 'normal'
      }
    }
  }
);
const RootStack = createSwitchNavigator(
  {
    Auth: AuthStack,
    Loading
  },
  {
    initialRouteName: 'Loading'
  }
);

const WrappedStack = () => <RootStack screenProps={{ t: i18n.getFixedT() }} />;

const ReloadAppOnLanguageChange = translate('translation', {
  bindI18n: 'languageChanged',
  bindStore: false
})(WrappedStack);

export default class App extends React.Component {
  state = {
    isSplashReady: false,
    isStoreReady: false,
    store: configureStore(() => {
      this.setState({ isStoreReady: true });
    })
  };

  cacheResources = async () => {
    await Expo.Font.loadAsync({
      CatamaranBold: require('./fonts/Catamaran-Bold.ttf'),
      CatamaranRegular: require('./fonts/Catamaran-Regular.ttf')
    });

    const images = [
      require('./assets/icon.png'),
      require('./assets/logo.png'),
      require('./assets/splash.png')
    ];
    const cacheImages = images.map(image =>
      Asset.fromModule(image).downloadAsync()
    );
    await Promise.all(cacheImages);
  };

  render() {
    if (!this.state.isSplashReady || !this.state.isStoreReady) {
      return (
        <AppLoading
          onError={console.warn} // eslint-disable-line
          onFinish={() => this.setState({ isSplashReady: true })}
          startAsync={this.cacheResources}
        />
      );
    }

    return (
      <Provider store={this.state.store}>
        <I18nextProvider i18n={i18n}>
          <ReloadAppOnLanguageChange />
        </I18nextProvider>
      </Provider>
    );
  }
}

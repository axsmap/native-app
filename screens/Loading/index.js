import { func, object } from 'prop-types';
import React from 'react';
import { ActivityIndicator as Spinner } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getProfile } from '../../modules/app';
import { baseFontSize, colors } from '../../misc/styles';

const SpinnerContainer = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;

  background-color: #ffffff;
`;

class Loading extends React.Component {
  static propTypes = {
    navigation: object.isRequired,
    getProfile: func.isRequired
  };

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => this.props.getProfile()
    );
  }

  render() {
    return (
      <SpinnerContainer>
        <Spinner
          size={verticalScale(baseFontSize * 4)}
          color={colors.primary}
        />
      </SpinnerContainer>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  getProfile: () => {
    dispatch(getProfile(ownProps.navigation.navigate));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(Loading);

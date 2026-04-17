/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import StyleSheet from '../StyleSheet';
import View from '../View';

type Props = {
  WrapperComponent?: ?React.ComponentType<*>,
  // $FlowFixMe
  children?: React.Children,
  rootTag: any
};

const RootTagContext: React.Context<any> = React.createContext(null);

const AppContainer: React.AbstractComponent<Props> = React.forwardRef(
  (props: Props, forwardedRef?: React.Ref<any>) => {
    const { children, WrapperComponent } = props;

    let innerView = (
      <View children={children} key={1} style={styles.appContainer} />
    );

    if (WrapperComponent) {
      innerView = <WrapperComponent>{innerView}</WrapperComponent>;
    }

    return (
      <RootTagContext.Provider value={props.rootTag}>
        <View ref={forwardedRef} style={styles.appContainer}>
          {innerView}
        </View>
      </RootTagContext.Provider>
    );
  }
);

AppContainer.displayName = 'AppContainer';

export default AppContainer;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    pointerEvents: 'box-none'
  }
});

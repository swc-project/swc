/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const emptyFunction = () => {};

function StatusBar(): null {
  return null;
}

StatusBar.setBackgroundColor = emptyFunction;
StatusBar.setBarStyle = emptyFunction;
StatusBar.setHidden = emptyFunction;
StatusBar.setNetworkActivityIndicatorVisible = emptyFunction;
StatusBar.setTranslucent = emptyFunction;

export default StatusBar;

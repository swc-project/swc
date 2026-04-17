/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import type { ColorValue } from '../../types';

import createElement from '../createElement';

type Props = {
  color?: ColorValue,
  label: string,
  testID?: string,
  value?: number | string
};

export default function PickerItem(props: Props) {
  const { color, label, testID, value } = props;
  const style = { color };
  return createElement('option', { children: label, style, testID, value });
}

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue, GenericStyleProp } from '../../types';
import type { TextStyle } from '../Text/types';
import type { ViewProps } from '../View/types';

export type TextInputStyle = {
  ...TextStyle,
  caretColor?: ColorValue,
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
};

export type TextInputProps = {
  ...ViewProps,
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words',
  autoComplete?: ?string,
  autoCompleteType?: ?string, // Compat with React Native (Bug react-native#26003)
  autoCorrect?: ?boolean,
  autoFocus?: ?boolean,
  blurOnSubmit?: ?boolean,
  caretHidden?: ?boolean,
  clearTextOnFocus?: ?boolean,
  defaultValue?: ?string,
  dir?: ?('auto' | 'ltr' | 'rtl'),
  disabled?: ?boolean,
  enterKeyHint?:
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send',
  inputAccessoryViewID?: ?string,
  inputMode?:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url',
  maxLength?: ?number,
  multiline?: ?boolean,
  onChange?: (e: any) => void,
  onChangeText?: (e: string) => void,
  onContentSizeChange?: (e: any) => void,
  onEndEditing?: (e: any) => void,
  onKeyPress?: (e: any) => void,
  onSelectionChange?: (e: any) => void,
  onScroll?: (e: any) => void,
  onSubmitEditing?: (e: any) => void,
  placeholder?: ?string,
  placeholderTextColor?: ?ColorValue,
  readOnly?: ?boolean,
  rows?: ?number,
  secureTextEntry?: ?boolean,
  selectTextOnFocus?: ?boolean,
  selection?: {|
    start: number,
    end?: number
  |},
  selectionColor?: ?ColorValue,
  showSoftInputOnFocus?: ?boolean,
  spellCheck?: ?boolean,
  style?: ?GenericStyleProp<TextInputStyle>,
  value?: ?string,
  // deprecated
  editable?: ?boolean,
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'number-pad'
    | 'numbers-and-punctuation'
    | 'numeric'
    | 'phone-pad'
    | 'search'
    | 'url'
    | 'web-search',
  numberOfLines?: ?number,
  returnKeyType?:
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send'
};

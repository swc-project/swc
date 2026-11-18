/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ImageProps } from '../Image';
import type { ViewProps } from '../View';

import * as React from 'react';
import { forwardRef } from 'react';
import Image from '../Image';
import StyleSheet from '../StyleSheet';
import View from '../View';

type ImageBackgroundProps = {
  ...ImageProps,
  imageRef?: any,
  imageStyle?: $PropertyType<ImageProps, 'style'>,
  style?: $PropertyType<ViewProps, 'style'>
};

const emptyObject = {};

/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 */
const ImageBackground: React.AbstractComponent<
  ImageBackgroundProps,
  React.ElementRef<typeof View>
> = forwardRef((props, forwardedRef) => {
  const {
    children,
    style = emptyObject,
    imageStyle,
    imageRef,
    ...rest
  } = props;
  const { height, width } = StyleSheet.flatten(style);

  return (
    <View ref={forwardedRef} style={style}>
      <Image
        {...rest}
        ref={imageRef}
        style={[
          {
            // Temporary Workaround:
            // Current (imperfect yet) implementation of <Image> overwrites width and height styles
            // (which is not quite correct), and these styles conflict with explicitly set styles
            // of <ImageBackground> and with our internal layout model here.
            // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
            // This workaround should be removed after implementing proper support of
            // intrinsic content size of the <Image>.
            width,
            height,
            zIndex: -1
          },
          StyleSheet.absoluteFill,
          imageStyle
        ]}
      />
      {children}
    </View>
  );
});

ImageBackground.displayName = 'ImageBackground';

export default ImageBackground;

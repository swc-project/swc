/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DefaultIterableDifferFactory} from './differs/default_iterable_differ';
import {DefaultKeyValueDifferFactory} from './differs/default_keyvalue_differ';
import {IterableDifferFactory, IterableDiffers} from './differs/iterable_differs';
import {KeyValueDifferFactory, KeyValueDiffers} from './differs/keyvalue_differs';

export {WrappedValue, devModeEqual} from './change_detection_util';
export {ChangeDetectorRef} from './change_detector_ref';
export {ChangeDetectionStrategy, ChangeDetectorStatus, isDefaultChangeDetectionStrategy} from './constants';
export {DefaultIterableDifferFactory} from './differs/default_iterable_differ';
export {DefaultIterableDiffer} from './differs/default_iterable_differ';
export {DefaultKeyValueDifferFactory} from './differs/default_keyvalue_differ';
export {
  CollectionChangeRecord,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDifferFactory,
  IterableDiffers,
  NgIterable,
  TrackByFunction
} from
'./differs/iterable_differs';
export {KeyValueChangeRecord, KeyValueChanges, KeyValueDiffer, KeyValueDifferFactory, KeyValueDiffers} from './differs/keyvalue_differs';
export {PipeTransform} from './pipe_transform';
export {SimpleChange, SimpleChanges} from '../interface/simple_change';



/**
 * Structural diffing for `Object`s and `Map`s.
 */
const keyValDiff: KeyValueDifferFactory[] = [new DefaultKeyValueDifferFactory()];

/**
 * Structural diffing for `Iterable` types such as `Array`s.
 */
const iterableDiff: IterableDifferFactory[] = [new DefaultIterableDifferFactory()];

export const defaultIterableDiffers = new IterableDiffers(iterableDiff);

export const defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);

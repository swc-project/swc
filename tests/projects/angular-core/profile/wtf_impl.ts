/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {global} from '../util/global';

/**
 * A scope function for the Web Tracing Framework (WTF).
 *
 * @publicApi
 * @deprecated the Web Tracing Framework is no longer supported in Angular
 */
export interface WtfScopeFn { (arg0?: any, arg1?: any): any; }

interface WTF {
  trace: Trace;
}

interface Trace {
  events: Events;
  leaveScope(scope: Scope, returnValue: any): any /** TODO #9100 */;
  beginTimeRange(rangeType: string, action: string): Range;
  endTimeRange(range: Range): any /** TODO #9100 */;
}

export interface Range {}

interface Events {
  createScope(signature: string, flags: any): Scope;
}

export interface Scope { (...args: any[] /** TODO #9100 */): any; }

let trace: Trace;
let events: Events;

export function detectWTF(): boolean {
  const wtf: WTF = (global as any /** TODO #9100 */)['wtf'];
  if (wtf) {
    trace = wtf['trace'];
    if (trace) {
      events = trace['events'];
      return true;
    }
  }
  return false;
}

export function createScope(signature: string, flags: any = null): any {
  return events.createScope(signature, flags);
}

export function leave<T>(scope: Scope): void;
export function leave<T>(scope: Scope, returnValue?: T): T;
export function leave<T>(scope: Scope, returnValue?: any): any {
  trace.leaveScope(scope, returnValue);
  return returnValue;
}

export function startTimeRange(rangeType: string, action: string): Range {
  return trace.beginTimeRange(rangeType, action);
}

export function endTimeRange(range: Range): void {
  trace.endTimeRange(range);
}

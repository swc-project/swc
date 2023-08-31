//// [bug25101.js]
/**
 * @template T
 * @extends {Set<T>} Should prefer this Set<T>, not the Set in the heritage clause
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
_wrap_native_super(Set);

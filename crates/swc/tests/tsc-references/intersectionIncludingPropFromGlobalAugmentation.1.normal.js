//// [intersectionIncludingPropFromGlobalAugmentation.ts]
// repro from https://github.com/microsoft/TypeScript/issues/54345
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
var target = _object_spread({}, source);
var toString = target.toString;
var hasOwn = target.hasOwnProperty; // not an own member but it should still be accessible
export { };

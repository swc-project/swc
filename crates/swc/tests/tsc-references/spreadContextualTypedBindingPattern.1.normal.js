//// [spreadContextualTypedBindingPattern.ts]
// #18308
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
// [ts] Initializer provides no value for this binding element and the binding element has no default value.
var _$_object_spread = _object_spread({}, bob, alice), naam = _$_object_spread.naam, age = _$_object_spread.age;

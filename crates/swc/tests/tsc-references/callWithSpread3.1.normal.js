//// [callWithSpread3.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
// error
fs2.apply(void 0, [
    'a'
].concat(_to_consumable_array(s2))); // error on ...s2
fs2.apply(void 0, [
    'a',
    'b',
    'c'
].concat(_to_consumable_array(s2))); // error on 'c' and ...s2
fs2.apply(void 0, [
    'a',
    'b'
].concat(_to_consumable_array(s2), [
    'c'
])); // error on ...s2 and 'c'
fs2.apply(void 0, [
    'a',
    'b',
    'c'
].concat(_to_consumable_array(s2), [
    'd'
])); // error on 'c', ...s2 and 'd'
fs2.apply(void 0, _to_consumable_array(s2).concat([
    'a'
])); // error on 'a'
fs2.apply(void 0, _to_consumable_array(s3)); // error on ...s3
fs2_.apply(void 0, _to_consumable_array(s_)); // error on ...s_
fs2_.apply(void 0, _to_consumable_array(s2n_)); // error on ...s2n_
fs2_.apply(void 0, _to_consumable_array(s_).concat(_to_consumable_array(s_))); // error on ...s_
fs2_.apply(void 0, _to_consumable_array(s_).concat(_to_consumable_array(s_), _to_consumable_array(s_))); // error on ...s_
// fs2n_(...s2, ...s_); //           FIXME: should be a type error
fs2n_.apply(void 0, _to_consumable_array(s2_)); // error on ...s2_
// ok
fs2_.apply(void 0, _to_consumable_array(s2_));
fs2_.apply(void 0, _to_consumable_array(s2_).concat(_to_consumable_array(s_)));
fs2_.apply(void 0, _to_consumable_array(s2_).concat(_to_consumable_array(s2_)));
fs2_.apply(void 0, _to_consumable_array(s_).concat(_to_consumable_array(s2_)));
fs2n_.apply(void 0, _to_consumable_array(s2n_));
fs2n_.apply(void 0, _to_consumable_array(s2));
// fs2n_(...s2, ...n_); // FIXME: should compile
fs5.apply(void 0, _to_consumable_array(s2).concat([
    "foo"
], _to_consumable_array(s2)));

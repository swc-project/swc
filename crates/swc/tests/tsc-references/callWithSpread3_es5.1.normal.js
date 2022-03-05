import * as swcHelpers from "@swc/helpers";
// error
fs2.apply(void 0, [
    'a'
].concat(swcHelpers.toConsumableArray(s2))); // error on ...s2
fs2.apply(void 0, [
    'a',
    'b',
    'c'
].concat(swcHelpers.toConsumableArray(s2))); // error on 'c' and ...s2
fs2.apply(void 0, [
    'a',
    'b'
].concat(swcHelpers.toConsumableArray(s2), [
    'c'
])); // error on ...s2 and 'c'
fs2.apply(void 0, [
    'a',
    'b',
    'c'
].concat(swcHelpers.toConsumableArray(s2), [
    'd'
])); // error on 'c', ...s2 and 'd'
fs2.apply(void 0, swcHelpers.toConsumableArray(s2).concat([
    'a'
])); // error on 'a'
fs2.apply(void 0, swcHelpers.toConsumableArray(s3)); // error on ...s3
fs2_.apply(void 0, swcHelpers.toConsumableArray(s_)); // error on ...s_
fs2_.apply(void 0, swcHelpers.toConsumableArray(s2n_)); // error on ...s2n_
fs2_.apply(void 0, swcHelpers.toConsumableArray(s_).concat(swcHelpers.toConsumableArray(s_))); // error on ...s_
fs2_.apply(void 0, swcHelpers.toConsumableArray(s_).concat(swcHelpers.toConsumableArray(s_), swcHelpers.toConsumableArray(s_))); // error on ...s_
// fs2n_(...s2, ...s_); //           FIXME: should be a type error
fs2n_.apply(void 0, swcHelpers.toConsumableArray(s2_)); // error on ...s2_
// ok
fs2_.apply(void 0, swcHelpers.toConsumableArray(s2_));
fs2_.apply(void 0, swcHelpers.toConsumableArray(s2_).concat(swcHelpers.toConsumableArray(s_)));
fs2_.apply(void 0, swcHelpers.toConsumableArray(s2_).concat(swcHelpers.toConsumableArray(s2_)));
fs2_.apply(void 0, swcHelpers.toConsumableArray(s_).concat(swcHelpers.toConsumableArray(s2_)));
fs2n_.apply(void 0, swcHelpers.toConsumableArray(s2n_));
fs2n_.apply(void 0, swcHelpers.toConsumableArray(s2));
// fs2n_(...s2, ...n_); // FIXME: should compile
fs5.apply(void 0, swcHelpers.toConsumableArray(s2).concat([
    "foo"
], swcHelpers.toConsumableArray(s2)));

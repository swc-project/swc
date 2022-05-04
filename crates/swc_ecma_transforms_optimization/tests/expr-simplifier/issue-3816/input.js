/** @license React v17.0.2
 * react-jsx-runtime.profiling.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";
require("object-assign");
var f = require("react"),
    g = 60103;
exports.Fragment = 60107;
if ("function" === typeof Symbol && Symbol.for) {
    var h = Symbol.for;
    g = h("react.element");
    exports.Fragment = h("react.fragment");
}
var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    n = Object.prototype.hasOwnProperty,
    p = { key: !0, ref: !0, __self: !0, __source: !0 };
function q(c, a, k) {
    var b,
        d = {},
        e = null,
        l = null;
    void 0 !== k && (e = "" + k);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (l = a.ref);
    for (b in a) n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
        for (b in ((a = c.defaultProps), a)) void 0 === d[b] && (d[b] = a[b]);
    return {
        $$typeof: g,
        type: c,
        key: e,
        ref: l,
        props: d,
        _owner: m.current,
    };
}
exports.jsx = q;
exports.jsxs = q;

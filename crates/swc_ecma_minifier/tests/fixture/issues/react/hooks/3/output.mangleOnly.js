"use strict";
__webpack_require__.d(__webpack_exports__, {
    Z: function() {
        return EnvironmentsSelector;
    }
});
var r = __webpack_require__(86677);
var t = __webpack_require__(45205);
var a = __webpack_require__(502);
var n = __webpack_require__(78869);
var e = __webpack_require__(16966);
var v = __webpack_require__(96236);
var o = __webpack_require__(70326);
function u(r, u) {
    var $ = (0, e.LP)();
    var c = (0, a.ZP)(), i = c.team;
    var d = i === null || i === void 0 ? void 0 : i.id;
    return (0, t.ZP)(r ? "".concat(v.Ms, "/git-branches").concat((0, o.c)({
        projectId: r,
        teamId: d
    })) : "", function(r) {
        return (0, n.Z)(r, $, {
            throwOnHTTPError: true
        });
    }, u);
}
var $ = __webpack_require__(76246);
export function EnvironmentsSelector(t) {
    var n = (0, r.useRouter)().query, e = n.project;
    var v = (0, $.useProject)(e), o = v.data;
    var c = (0, a.ZP)(), i = c.teamSlug;
    var d = o === null || o === void 0 ? void 0 : o.id;
    var l = u(d), P = l.data;
    return {};
}

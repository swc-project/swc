"use strict";
__webpack_require__.d(__webpack_exports__, {
    Z: function() {
        return EnvironmentsSelector;
    }
});
var r = __webpack_require__(86677);
var a = __webpack_require__(45205);
var t = __webpack_require__(502);
var v = __webpack_require__(78869);
var n = __webpack_require__(16966);
var o = __webpack_require__(96236);
var e = __webpack_require__(70326);
function u(r, u) {
    var $ = (0, n.LP)();
    var c = (0, t.ZP)(), d = c.team;
    var i = d === null || d === void 0 ? void 0 : d.id;
    return (0, a.ZP)(r ? "".concat(o.Ms, "/git-branches").concat((0, e.c)({
        projectId: r,
        teamId: i
    })) : "", function(r) {
        return (0, v.Z)(r, $, {
            throwOnHTTPError: true
        });
    }, u);
}
var $ = __webpack_require__(76246);
export function EnvironmentsSelector(a) {
    var v = (0, r.useRouter)().query, n = v.project;
    var o = (0, $.useProject)(n), e = o.data;
    var c = (0, t.ZP)(), d = c.teamSlug;
    var i = e === null || e === void 0 ? void 0 : e.id;
    var P = u(i), l = P.data;
    return {};
}

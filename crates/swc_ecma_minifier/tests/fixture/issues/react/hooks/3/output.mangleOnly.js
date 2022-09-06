"use strict";
__webpack_require__.d(__webpack_exports__, {
    Z: function() {
        return EnvironmentsSelector;
    }
});
var r = __webpack_require__(86677);
var e = __webpack_require__(45205);
var $ = __webpack_require__(502);
var a = __webpack_require__(78869);
var t = __webpack_require__(16966);
var c = __webpack_require__(96236);
var u = __webpack_require__(70326);
function n(r, n) {
    var i = (0, t.LP)();
    var o = (0, $.ZP)(), v = o.team;
    var p = v === null || v === void 0 ? void 0 : v.id;
    return (0, e.ZP)(r ? "".concat(c.Ms, "/git-branches").concat((0, u.c)({
        projectId: r,
        teamId: p
    })) : "", function(r) {
        return (0, a.Z)(r, i, {
            throwOnHTTPError: true
        });
    }, n);
}
var i = __webpack_require__(76246);
export function EnvironmentsSelector(e) {
    var a = (0, r.useRouter)().query, t = a.project;
    var c = (0, i.useProject)(t), u = c.data;
    var o = (0, $.ZP)(), v = o.teamSlug;
    var p = u === null || u === void 0 ? void 0 : u.id;
    var b = n(p), d = b.data;
    return {};
}

"use strict";
__webpack_require__.d(__webpack_exports__, {
    Z: function() {
        return EnvironmentsSelector;
    }
});
var a = __webpack_require__(86677);
var b = __webpack_require__(45205);
var c = __webpack_require__(502);
var d = __webpack_require__(78869);
var e = __webpack_require__(16966);
var f = __webpack_require__(96236);
var g = __webpack_require__(70326);
function h(a, h) {
    var i = (0, e.LP)();
    var j = (0, c.ZP)(), k = j.team;
    var l = k === null || k === void 0 ? void 0 : k.id;
    return (0, b.ZP)(a ? "".concat(f.Ms, "/git-branches").concat((0, g.c)({
        projectId: a,
        teamId: l
    })) : "", function(a) {
        return (0, d.Z)(a, i, {
            throwOnHTTPError: true
        });
    }, h);
}
var i = __webpack_require__(76246);
export function EnvironmentsSelector(b) {
    var d = (0, a.useRouter)().query, e = d.project;
    var f = (0, i.useProject)(e), g = f.data;
    var j = (0, c.ZP)(), k = j.teamSlug;
    var l = g === null || g === void 0 ? void 0 : g.id;
    var m = h(l), n = m.data;
    return {};
}

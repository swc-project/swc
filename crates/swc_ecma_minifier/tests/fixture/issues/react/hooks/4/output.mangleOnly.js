"use strict";
var r = __webpack_require__(86677);
var _ = __webpack_require__(45205);
var e = __webpack_require__(502);
var a = __webpack_require__(78869);
var c = __webpack_require__(16966);
var t = __webpack_require__(96236);
var u = __webpack_require__(70326);
export function useProjectBranches(r, i) {
    var n = (0, c.LP)();
    var v = (0, e.ZP)(), o = v.team;
    var p = o === null || o === void 0 ? void 0 : o.id;
    return (0, _.ZP)(r ? "".concat(t.Ms, "/git-branches").concat((0, u.c)({
        projectId: r,
        teamId: p
    })) : "", function(r) {
        return (0, a.Z)(r, n, {
            throwOnHTTPError: true
        });
    }, i);
}

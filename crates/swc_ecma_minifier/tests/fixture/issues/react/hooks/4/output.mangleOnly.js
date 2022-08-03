"use strict";
var r = __webpack_require__(86677);
var a = __webpack_require__(45205);
var t = __webpack_require__(502);
var v = __webpack_require__(78869);
var n = __webpack_require__(16966);
var o = __webpack_require__(96236);
var c = __webpack_require__(70326);
export function useProjectBranches(r, e) {
    var $ = (0, n.LP)();
    var u = (0, t.ZP)(), d = u.team;
    var i = d === null || d === void 0 ? void 0 : d.id;
    return (0, a.ZP)(r ? "".concat(o.Ms, "/git-branches").concat((0, c.c)({
        projectId: r,
        teamId: i
    })) : "", function(r) {
        return (0, v.Z)(r, $, {
            throwOnHTTPError: true
        });
    }, e);
}

"use strict";
var r = __webpack_require__(86677);
var a = __webpack_require__(45205);
var t = __webpack_require__(502);
var c = __webpack_require__(78869);
var e = __webpack_require__(16966);
var n = __webpack_require__(96236);
var v = __webpack_require__(70326);
export function useProjectBranches(r, o) {
    var $ = (0, e.LP)();
    var u = (0, t.ZP)(), i = u.team;
    var s = i === null || i === void 0 ? void 0 : i.id;
    return (0, a.ZP)(r ? "".concat(n.Ms, "/git-branches").concat((0, v.c)({
        projectId: r,
        teamId: s
    })) : "", function(r) {
        return (0, c.Z)(r, $, {
            throwOnHTTPError: true
        });
    }, o);
}

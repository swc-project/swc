"use strict";
__webpack_require__(86677);
var index_esm = __webpack_require__(45205), use_team = __webpack_require__(502), fetch_api = __webpack_require__(78869), authenticate = __webpack_require__(16966), api_endpoints = __webpack_require__(96236), qs = __webpack_require__(70326);
export function useProjectBranches(projectId, opts) {
    var token = (0, authenticate /* getToken */ .LP)(), team = (0, use_team /* default */ .ZP)().team, teamId = null == team ? void 0 : team.id;
    return (0, index_esm /* default */ .ZP)(projectId ? "".concat(api_endpoints /* API_INTEGRATION_CONTROLLER */ .Ms, "/git-branches").concat((0, qs /* encode */ .c)({
        projectId: projectId,
        teamId: teamId
    })) : "", function(endpoint) {
        return (0, fetch_api /* default */ .Z)(endpoint, token, {
            throwOnHTTPError: !0
        });
    }, opts);
}

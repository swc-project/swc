"use strict";
__webpack_require__.d(__webpack_exports__, {
    Z: function() {
        return /* binding */ EnvironmentsSelector;
    }
});
var router = __webpack_require__(86677), index_esm = __webpack_require__(45205), use_team = __webpack_require__(502), fetch_api = __webpack_require__(78869), authenticate = __webpack_require__(16966), api_endpoints = __webpack_require__(96236), qs = __webpack_require__(70326), use_project = __webpack_require__(76246);
export function EnvironmentsSelector(param) {
    var projectId, token, team, teamId, projectName = (0, router.useRouter)().query.project, projectInfo = (0, use_project.useProject)(projectName).data;
    return (0, use_team /* default */ .ZP)().teamSlug, (projectId = null == projectInfo ? void 0 : projectInfo.id, token = (0, authenticate /* getToken */ .LP)(), teamId = null == (team = (0, use_team /* default */ .ZP)().team) ? void 0 : team.id, (0, index_esm /* default */ .ZP)(projectId ? "".concat(api_endpoints /* API_INTEGRATION_CONTROLLER */ .Ms, "/git-branches").concat((0, qs /* encode */ .c)({
        projectId: projectId,
        teamId: teamId
    })) : "", function(endpoint) {
        return (0, fetch_api /* default */ .Z)(endpoint, token, {
            throwOnHTTPError: !0
        });
    }, void 0)).data, {};
}

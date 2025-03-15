"use strict";
__webpack_require__.d(__webpack_exports__, {
    Z: function() {
        return /* binding */ EnvironmentsSelector;
    }
});
var router = __webpack_require__(86677), index_esm = __webpack_require__(45205), use_team = __webpack_require__(502), fetch_api = __webpack_require__(78869), authenticate = __webpack_require__(16966), api_endpoints = __webpack_require__(96236), qs = __webpack_require__(70326), use_project = __webpack_require__(76246);
export function EnvironmentsSelector(param) {
    var projectId, token, team, teamId, projectName = router.useRouter().query.project, projectInfo = use_project.useProject(projectName).data;
    return use_team /* default */ .ZP().teamSlug, (projectId = null == projectInfo ? void 0 : projectInfo.id, token = authenticate /* getToken */ .LP(), teamId = null == (team = use_team /* default */ .ZP().team) ? void 0 : team.id, index_esm /* default */ .ZP(projectId ? "".concat(api_endpoints /* API_INTEGRATION_CONTROLLER */ .Ms, "/git-branches").concat(qs /* encode */ .c({
        projectId: projectId,
        teamId: teamId
    })) : "", function(endpoint) {
        return fetch_api /* default */ .Z(endpoint, token, {
            throwOnHTTPError: !0
        });
    }, void 0)).data, {};
}

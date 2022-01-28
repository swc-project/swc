"use strict";
__webpack_require__.d(__webpack_exports__, {
    "Z": function () { return /* binding */ EnvironmentsSelector; }
});
var router = __webpack_require__(86677);
var index_esm = __webpack_require__(45205);
var use_team = __webpack_require__(502);
var fetch_api = __webpack_require__(78869);
var authenticate = __webpack_require__(16966);
var api_endpoints = __webpack_require__(96236);
var qs = __webpack_require__(70326);

function useProjectBranches(projectId, opts) {
    var token = (0, authenticate/* getToken */.LP)();
    var ref = (0, use_team/* default */.ZP)(), team = ref.team;
    var teamId = team === null || team === void 0 ? void 0 : team.id;
    return (0, index_esm/* default */.ZP)(projectId ? "".concat(api_endpoints/* API_INTEGRATION_CONTROLLER */.Ms, "/git-branches").concat((0, qs/* encode */.c)({
        projectId: projectId,
        teamId: teamId
    })) : '', function (endpoint) {
        return (0, fetch_api/* default */.Z)(endpoint, token, {
            throwOnHTTPError: true
        });
    }, opts);
}

var use_project = __webpack_require__(76246);

export function EnvironmentsSelector(param) {
    var _query = (0, router.useRouter)().query, projectName = _query.project;
    var ref = (0, use_project.useProject)(projectName), projectInfo = ref.data;
    var ref1 = (0, use_team/* default */.ZP)(), teamSlug = ref1.teamSlug;
    var projectId = projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.id;
    var ref2 = useProjectBranches(projectId), branches = ref2.data;
    return {};
};


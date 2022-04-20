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

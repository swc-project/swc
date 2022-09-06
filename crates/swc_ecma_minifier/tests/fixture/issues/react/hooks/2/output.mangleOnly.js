function t(t, e) {
    var n = (0, authenticate.LP)();
    var r = (0, use_team.ZP)(), a = r.team;
    var c = a === null || a === void 0 ? void 0 : a.id;
    return (0, index_esm.ZP)(t ? "".concat(api_endpoints.Ms, "/git-branches").concat((0, qs.c)({
        projectId: t,
        teamId: c
    })) : "", function(t) {
        return (0, fetch_api.Z)(t, n, {
            throwOnHTTPError: true
        });
    }, e);
}

function a(a, b) {
    var c = (0, authenticate.LP)();
    var d = (0, use_team.ZP)(), e = d.team;
    var f = e === null || e === void 0 ? void 0 : e.id;
    return (0, index_esm.ZP)(a ? "".concat(api_endpoints.Ms, "/git-branches").concat((0, qs.c)({
        projectId: a,
        teamId: f
    })) : "", function(a) {
        return (0, fetch_api.Z)(a, c, {
            throwOnHTTPError: true
        });
    }, b);
}

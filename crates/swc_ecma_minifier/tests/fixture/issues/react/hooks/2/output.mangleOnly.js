function a(b, c) {
    var f = (0, authenticate.LP)();
    var d = (0, use_team.ZP)(), a = d.team;
    var e = a === null || a === void 0 ? void 0 : a.id;
    return (0, index_esm.ZP)(b ? "".concat(api_endpoints.Ms, "/git-branches").concat((0, qs.c)({
        projectId: b,
        teamId: e
    })) : "", function(a) {
        return (0, fetch_api.Z)(a, f, {
            throwOnHTTPError: true
        });
    }, c);
}

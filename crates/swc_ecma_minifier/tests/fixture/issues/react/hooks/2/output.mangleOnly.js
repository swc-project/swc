function r(r, t) {
    var n = (0, authenticate.LP)();
    var c = (0, use_team.ZP)(), o = c.team;
    var a = o === null || o === void 0 ? void 0 : o.id;
    return (0, index_esm.ZP)(r ? "".concat(api_endpoints.Ms, "/git-branches").concat((0, qs.c)({
        projectId: r,
        teamId: a
    })) : "", function(r) {
        return (0, fetch_api.Z)(r, n, {
            throwOnHTTPError: true
        });
    }, t);
}

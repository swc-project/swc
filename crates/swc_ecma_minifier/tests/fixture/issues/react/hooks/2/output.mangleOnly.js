function r(r, t) {
    var n = (0, authenticate.LP)();
    var o = (0, use_team.ZP)(), c = o.team;
    var a = c === null || c === void 0 ? void 0 : c.id;
    return (0, index_esm.ZP)(r ? "".concat(api_endpoints.Ms, "/git-branches").concat((0, qs.c)({
        projectId: r,
        teamId: a
    })) : "", function(r) {
        return (0, fetch_api.Z)(r, n, {
            throwOnHTTPError: true
        });
    }, t);
}

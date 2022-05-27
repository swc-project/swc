export const obj = {
    _routeToRegExp: function(a) {
        a = a.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(a, b) {
            return b ? a : "([^/]+)";
        }).replace(splatParam, "(.*?)");
        return new RegExp("^" + a + "$");
    }
};

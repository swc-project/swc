export const obj = {
    _routeToRegExp: function(e) {
        e = e.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(e, a) {
            return a ? e : "([^/]+)";
        }).replace(splatParam, "(.*?)");
        return new RegExp("^" + e + "$");
    }
};

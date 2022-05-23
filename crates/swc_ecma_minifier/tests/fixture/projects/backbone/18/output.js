export const obj = {
    _routeToRegExp: function(route) {
        return route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
            return optional ? match : "([^/]+)";
        }).replace(splatParam, "(.*?)"), new RegExp("^" + route + "$");
    }
};

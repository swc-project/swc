_.contains = _.include = function(a, b) {
    if (a == null) return false;
    if (nativeIndexOf && a.indexOf === nativeIndexOf) return a.indexOf(b) != -1;
    return any(a, function(a) {
        return a === b;
    });
};

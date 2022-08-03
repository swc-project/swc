_.contains = _.include = function(n, e) {
    if (n == null) return false;
    if (nativeIndexOf && n.indexOf === nativeIndexOf) return n.indexOf(e) != -1;
    return any(n, function(n) {
        return n === e;
    });
};

if (typeof /./ !== "function") {
    _.isFunction = function(a) {
        return typeof a === "function";
    };
}

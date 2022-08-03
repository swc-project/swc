if (typeof /./ !== "function") {
    _.isFunction = function(n) {
        return typeof n === "function";
    };
}

if (typeof /./ !== "function") {
    _.isFunction = function (obj) {
        return typeof obj === "function";
    };
}

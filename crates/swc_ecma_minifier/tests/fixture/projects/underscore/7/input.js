_.partial = function (func) {
    var args = slice.call(arguments, 1);
    return function () {
        return func.apply(this, args.concat(slice.call(arguments)));
    };
};
_.mixin = function (obj) {
    each(_.functions(obj), function (name) {
        var func = (_[name] = obj[name]);
        _.prototype[name] = function () {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return result.call(this, func.apply(_, args));
        };
    });
};

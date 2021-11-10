_.mixin = function(obj) {
    each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
            var args = [
                this._wrapped
            ];
            return push.apply(args, arguments), result.call(this, func.apply(_, args));
        };
    });
};

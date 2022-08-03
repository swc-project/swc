_.mixin = function(n) {
    each(_.functions(n), function(t) {
        var i = (_[t] = n[t]);
        _.prototype[t] = function() {
            var n = [
                this._wrapped
            ];
            push.apply(n, arguments);
            return result.call(this, i.apply(_, n));
        };
    });
};

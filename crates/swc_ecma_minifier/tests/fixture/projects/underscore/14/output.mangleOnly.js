_.mixin = function(n) {
    each(_.functions(n), function(t) {
        var p = (_[t] = n[t]);
        _.prototype[t] = function() {
            var n = [
                this._wrapped
            ];
            push.apply(n, arguments);
            return result.call(this, p.apply(_, n));
        };
    });
};

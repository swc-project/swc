_.mixin = function(a) {
    each(_.functions(a), function(b) {
        var c = (_[b] = a[b]);
        _.prototype[b] = function() {
            var a = [
                this._wrapped
            ];
            push.apply(a, arguments);
            return result.call(this, c.apply(_, a));
        };
    });
};

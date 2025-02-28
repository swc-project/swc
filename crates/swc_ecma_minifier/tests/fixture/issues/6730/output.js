function n(i, e, u, t, r, a, c) {
    try {
        var o = i[a](c);
        var n = o.value;
    } catch (n) {
        u(n);
        return;
    }
    if (o.done) e(n);
    else Promise.resolve(n).then(t, r);
}
function e(e) {
    return function() {
        var t = this, r = arguments;
        return new Promise(function(i, u) {
            var a = e.apply(t, r);
            function o(e) {
                n(a, i, u, o, c, "next", e);
            }
            function c(e) {
                n(a, i, u, o, c, "throw", e);
            }
            o(void 0);
        });
    };
}
export const styleLoader = ()=>({
        name: 'style-loader',
        setup (n) {
            n.onLoad({
                filter: /.*/,
                namespace: 'less'
            }, function() {
                var n = e(function*(n) {});
                return function(e) {
                    return n.apply(this, arguments);
                };
            }());
        }
    });

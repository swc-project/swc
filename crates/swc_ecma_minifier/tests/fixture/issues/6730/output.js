function n(n, e, t, r, o, i, u) {
    try {
        var a = n[i](u);
        var c = a.value;
    } catch (n) {
        t(n);
        return;
    }
    if (a.done) e(c);
    else Promise.resolve(c).then(r, o);
}
function e(e) {
    return function() {
        var t = this, r = arguments;
        return new Promise(function(o, i) {
            var u = e.apply(t, r);
            function a(e) {
                n(u, o, i, a, c, "next", e);
            }
            function c(e) {
                n(u, o, i, a, c, "throw", e);
            }
            a(void 0);
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

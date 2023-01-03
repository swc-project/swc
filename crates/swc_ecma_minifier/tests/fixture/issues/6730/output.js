function n(n, e, t, r, o, u, i) {
    try {
        var a = n[u](i);
        var c = a.value;
    } catch (s) {
        t(s);
        return;
    }
    if (a.done) e(c);
    else Promise.resolve(c).then(r, o);
}
function e(e) {
    return function() {
        var t = this, r = arguments;
        return new Promise(function(o, u) {
            var i = e.apply(t, r);
            function a(e) {
                n(i, o, u, a, c, "next", e);
            }
            function c(e) {
                n(i, o, u, a, c, "throw", e);
            }
            a(void 0);
        });
    };
}
export const styleLoader = ()=>{
    return {
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
    };
};

"module evaluation";
function n(n, e, t, r, o, u, a) {
    try {
        var i = n[u](a);
        var c = i.value;
    } catch (n) {
        t(n);
        return;
    }
    if (i.done) e(c);
    else Promise.resolve(c).then(r, o);
}
function e(e) {
    return function() {
        var t = this, r = arguments;
        return new Promise(function(o, u) {
            var a = e.apply(t, r);
            function i(e) {
                n(a, o, u, i, c, "next", e);
            }
            function c(e) {
                n(a, o, u, i, c, "throw", e);
            }
            i(void 0);
        });
    };
}
const t = ()=>({
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
export { t as styleLoader };

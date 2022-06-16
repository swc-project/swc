var a, G;
a(), a(1), a(1, 2), function(G) {
    var a;
    a(), a(!0), a(!0, 2), a(1, !0);
}(G || (G = {}));

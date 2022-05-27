if (w) ;
else {
    (function a() {})();
}
if (!x) {
    (function() {
        x = {};
    })();
}
if (y) (function() {})();
else (function(a) {
    return a;
})(0);

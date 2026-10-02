const a = 100;
(function(N) {
    N.a = 1;
})(N || (N = {}));
(function(N) {
    N.b = N.a + 1;
})(N || (N = {}));
console.log(N.b, a);
var N;

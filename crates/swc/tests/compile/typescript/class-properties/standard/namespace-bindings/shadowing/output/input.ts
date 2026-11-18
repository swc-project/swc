const privateValue = 100;
const T = 5;
(function(N) {
    const privateValue = 10;
    N.x = 1;
    function first() {
        return privateValue;
    }
    N.first = first;
})(N || (N = {}));
(function(N) {
    N.outside = privateValue + T;
    function parameter(x) {
        return x;
    }
    N.parameter = parameter;
    function local() {
        const x = 20;
        return x;
    }
    N.local = local;
    function shared() {
        return N.x;
    }
    N.shared = shared;
})(N || (N = {}));
console.log(N.first(), N.outside, N.parameter(30), N.local(), N.shared());
var N;

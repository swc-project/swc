(function(N) {
    N.value = 0;
})(N || (N = {}));
(function(N) {
    N.value++;
    ({ value: N.value } = {
        value: 2
    });
    for (N.value of [
        3
    ]){}
    N.result = {
        value: N.value
    };
})(N || (N = {}));
console.log(N.value, N.result.value);
var N;

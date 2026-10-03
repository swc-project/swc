(function(N) {
    N.value = 3;
    function read() {
        return N.value;
    }
    N.read = read;
})(N || (N = {}));
function outside(value) {
    return value + N.read();
}
const value = 4;
const result = outside(value);
const object = {
    value
};
console.log(result, object.value, N.value);
var N;

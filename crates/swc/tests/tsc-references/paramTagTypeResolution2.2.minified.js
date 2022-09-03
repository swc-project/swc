//// [38572.js]
function f(a, b) {}
f({
    x: 42
}, {
    x: function(param) {
        param.toFixed();
    }
});

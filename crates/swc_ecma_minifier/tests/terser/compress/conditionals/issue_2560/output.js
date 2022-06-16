function log(x) {
    console.log(x);
}
function bar() {
    x !== (x = log) ? x(1) : x(2);
}
var x = function() {
    console.log("init");
};
bar();
bar();

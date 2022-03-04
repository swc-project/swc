function log(x1) {
    console.log(x1);
}
function bar() {
    x !== (x = log) ? x(1) : x(2);
}
var x = function() {
    console.log("init");
};
bar();
bar();

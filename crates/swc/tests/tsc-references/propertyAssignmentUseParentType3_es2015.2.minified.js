function foo2() {
    return [];
}
function foo3() {
    return "";
}
(function() {
    return 123;
}).toFixed = "", foo2.join = "", foo3.trim = "", (function() {
    return {
        x: 123
    };
}).x = "456";

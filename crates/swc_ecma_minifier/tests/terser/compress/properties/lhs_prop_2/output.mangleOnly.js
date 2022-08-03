[
    1
][0] = 42;
(function(n) {
    n.b = "g";
})("abc");
(function(n) {
    n[2] = "g";
})("def");
(function(n) {
    n[""] = "g";
})("ghi");

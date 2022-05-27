[
    1
][0] = 42;
(function(a) {
    a.b = "g";
})("abc");
(function(a) {
    a[2] = "g";
})("def");
(function(a) {
    a[""] = "g";
})("ghi");

(function(f) {
    return f;
})((x)=>x)("foo"), (function(f) {
    return f;
})((x)=>x)("foo");
let h = function(f) {
    return f;
}((x)=>x);
h("foo"), h("bar");

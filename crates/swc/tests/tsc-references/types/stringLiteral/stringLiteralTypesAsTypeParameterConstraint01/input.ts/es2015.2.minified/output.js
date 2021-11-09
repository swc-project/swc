function foo(f) {
    return f;
}
foo((x)=>x
)("foo"), foo((x)=>x
)("foo");
let h = function(f) {
    return f;
}((x)=>x
);
h("foo"), h("bar");

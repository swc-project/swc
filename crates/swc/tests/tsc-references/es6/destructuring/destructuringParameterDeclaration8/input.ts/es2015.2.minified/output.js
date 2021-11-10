function test({ method ="z" , nested: { p ="c"  }  }) {
}
test({
}), test({
    method: "x",
    nested: {
        p: "a"
    }
}), test({
    method: "z",
    nested: {
        p: "b"
    }
}), test({
    method: "one",
    nested: {
        p: "a"
    }
});

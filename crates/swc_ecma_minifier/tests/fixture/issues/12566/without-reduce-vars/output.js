!function() {
    function* gen(label) {
        console.log(label), yield 1;
    }
    [
        ...gen("inlined call")
    ], [
        ...gen("empty callee")
    ], [
        ...gen("sequence")
    ], console.log("after sequence"), [
        ...gen("new")
    ], Date(...gen("Date")), [
        ...gen("Math.max")
    ], [
        ...gen("string method")
    ];
    let it = [
        1,
        2
    ][Symbol.iterator]();
    [
        ...it
    ], console.log(it.next().done);
    try {
        [
            ...null
        ], console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
    try {
        [
            ...null
        ], console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
    try {
        [
            ...null
        ], console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
    try {
        (function() {})?.(...null), console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
    [
        ...gen("annotated call")
    ], [
        ...gen("annotated new")
    ];
    try {
        [
            ...null
        ], console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
    console.log("ordinary");
}();

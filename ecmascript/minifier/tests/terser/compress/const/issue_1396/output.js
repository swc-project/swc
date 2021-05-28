function foo(a) {
    return (
        console.log(3), console.log(2), console.log(1), void console.log(1 & a)
    );
}
function bar() {
    return (
        console.log(
            "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
        ),
        void console.log("abcabcabcabcabc")
    );
}

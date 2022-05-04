var a = 2;
function foo() {
    try {
        var a = 1;
        a;
    } catch (err) {
        // ignored
    }
    a;
}

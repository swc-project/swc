function f() {
    var value$2 = "original string";
    if (true) {
        var value$21 = "new string";
        console.log(value$2);
    }
    [].map(function x(_) {
        var value$2; // this causes the previous value$2 to become value$21
        return value$2;
    });
}

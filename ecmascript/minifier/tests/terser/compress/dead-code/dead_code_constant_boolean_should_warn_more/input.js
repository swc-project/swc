while (!((foo && bar) || x + "0")) {
    console.log("unreachable");
    var foo;
    function bar() {}
}
for (var x = 10, y; x && (y || x) && !typeof x; ++x) {
    asdf();
    foo();
    var moo;
}
bar();

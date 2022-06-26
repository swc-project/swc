var a = console.log.bind(console);
function b(b) {
    var c = b.y * 2;
    a("Foo:", c);
}
b({
    y: 10
});

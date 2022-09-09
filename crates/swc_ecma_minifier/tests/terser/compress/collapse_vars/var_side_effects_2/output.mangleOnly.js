var o = console.log.bind(console);
function n(n) {
    var c = n.y * 2;
    o("Foo:", c);
}
n({ y: 10 });

var n = console.log.bind(console);
function o(o) {
    var c = o.y * 2;
    n("Foo:", c);
}
o({
    y: 10
});

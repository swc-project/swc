var o = console.log.bind(console);
function n(n) {
    var a = n.y * 2;
    o("Foo:", a);
}
n({
    y: 10
});

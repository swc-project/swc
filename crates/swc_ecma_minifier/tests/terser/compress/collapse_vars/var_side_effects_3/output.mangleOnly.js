var n = console.log.bind(console);
function a(a) {
    var i = a.y * 2;
    n("Foo:", i);
}
a({
    y: 10
});

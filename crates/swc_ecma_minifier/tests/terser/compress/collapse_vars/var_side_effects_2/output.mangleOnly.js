var b = console.log.bind(console);
function a(a) {
    var c = a.y * 2;
    b("Foo:", c);
}
a({
    y: 10
});

function a(a) {
    a.thing = false;
}
console.log((function() {
    var b = {
        thing: true
    };
    a(b);
    return b.thing;
})());

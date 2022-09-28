function n(n) {
    n.thing = false;
}
console.log((function() {
    var t = {
        thing: true
    };
    n(t);
    return t.thing;
})());

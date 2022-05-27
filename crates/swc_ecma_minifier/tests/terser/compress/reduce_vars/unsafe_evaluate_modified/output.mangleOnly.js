console.log((function() {
    var a = {
        p: 1
    };
    a.p++;
    console.log(a.p);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 2
    };
    --a.p;
    console.log(a.p);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 3
    };
    a.p += "";
    console.log(a.p);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 4
    };
    a = {};
    console.log(a.p);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 5
    };
    a.p = -9;
    console.log(a.p);
    return a.p;
})());
function a() {
    this.p++;
}
console.log((function() {
    var b = {
        p: 6
    };
    a.call(b);
    console.log(b.p);
    return b.p;
})());
console.log((function() {
    var a = {
        p: 7
    };
    console.log([
        a
    ][0].p++);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 8
    };
    console.log({
        q: a
    }.q.p++);
    return a.p;
})());

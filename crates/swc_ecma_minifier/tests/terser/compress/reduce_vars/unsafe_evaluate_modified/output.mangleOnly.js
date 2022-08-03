console.log((function() {
    var p = {
        p: 1
    };
    p.p++;
    console.log(p.p);
    return p.p;
})());
console.log((function() {
    var p = {
        p: 2
    };
    --p.p;
    console.log(p.p);
    return p.p;
})());
console.log((function() {
    var p = {
        p: 3
    };
    p.p += "";
    console.log(p.p);
    return p.p;
})());
console.log((function() {
    var p = {
        p: 4
    };
    p = {};
    console.log(p.p);
    return p.p;
})());
console.log((function() {
    var p = {
        p: 5
    };
    p.p = -9;
    console.log(p.p);
    return p.p;
})());
function p() {
    this.p++;
}
console.log((function() {
    var n = {
        p: 6
    };
    p.call(n);
    console.log(n.p);
    return n.p;
})());
console.log((function() {
    var p = {
        p: 7
    };
    console.log([
        p
    ][0].p++);
    return p.p;
})());
console.log((function() {
    var p = {
        p: 8
    };
    console.log({
        q: p
    }.q.p++);
    return p.p;
})());

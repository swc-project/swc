function n(n) {
    var i = n.splice(0, 2);
    return [
        ...n,
        ...i
    ];
}
console.log(n([
    1,
    2,
    3
]).join(" "));

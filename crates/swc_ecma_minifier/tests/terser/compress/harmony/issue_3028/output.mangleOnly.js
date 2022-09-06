function n(n) {
    var o = n.splice(0, 2);
    return [...n, ...o];
}
console.log(n([1, 2, 3]).join(" "));

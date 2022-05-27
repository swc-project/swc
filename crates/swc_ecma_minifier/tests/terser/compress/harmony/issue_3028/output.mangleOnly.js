function a(a) {
    var b = a.splice(0, 2);
    return [
        ...a,
        ...b
    ];
}
console.log(a([
    1,
    2,
    3
]).join(" "));

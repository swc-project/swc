function nested() {
    var a = 2;
    for (var a of [
        1
    ])break;
    return a;
}
console.log(nested());

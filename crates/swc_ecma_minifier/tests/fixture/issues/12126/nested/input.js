function nested() {
    return function(a) {
        for (var a of [1]) break;
        return a;
    }(2);
}

console.log(nested());

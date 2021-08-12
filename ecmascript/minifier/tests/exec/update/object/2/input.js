function inc() {
    this.p++;
}
console.log(function () {
    inc.call({
        p: 6
    });
    console.log(6);
    return 6;
}());
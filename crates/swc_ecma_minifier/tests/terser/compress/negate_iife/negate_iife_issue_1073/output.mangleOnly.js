new ((function (n) {
    return function o() {
        this.x = n;
        console.log(this);
    };
})(7))();

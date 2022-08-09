new ((function(n) {
    return function t() {
        this.x = n;
        console.log(this);
    };
})(7))();

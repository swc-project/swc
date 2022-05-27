new ((function(a) {
    return function b() {
        this.x = a;
        console.log(this);
    };
})(7))();

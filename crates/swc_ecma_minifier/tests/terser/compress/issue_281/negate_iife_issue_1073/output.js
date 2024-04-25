new (function(a) {
    return function() {
        this.x = 7, console.log(this);
    };
}(0))();

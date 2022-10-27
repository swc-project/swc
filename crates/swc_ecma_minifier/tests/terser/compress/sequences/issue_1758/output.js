console.log(function(c) {
    return function() {
        c--, c--, c.toString();
        return;
    }();
}());

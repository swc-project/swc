(function() {
    var a = 1;
    a; // 'i' should remain (dynamic)
    eval('');
}());

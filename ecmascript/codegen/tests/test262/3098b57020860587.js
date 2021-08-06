(function() {
    var a = 1; // should not hoist to parameter
    eval('');
}());

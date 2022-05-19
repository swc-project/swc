function foo(x) {
    return x(null);
}
foo((x)=>''), foo((x)=>''), foo((x)=>''), function(x, cb) {
    cb(1);
}(1, function(a) {
    return '';
}), function(x, cb) {
    cb(1);
}(1, (a)=>''), function(x, cb) {
    cb('');
}('', (a)=>1), function(x, cb, y) {
    cb(1);
}(1, (a)=>'', ''), function(x, cb, y) {
    cb(1);
}(1, function(a) {
    return '';
}, 1), function(x, cb, y) {
    cb(1);
}(1, (a)=>'', '');

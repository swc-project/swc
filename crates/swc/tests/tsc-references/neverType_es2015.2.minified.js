function error(message) {
    throw Error(message);
}
(function(cb) {
    cb();
})(()=>"hello"), function(cb) {
    cb();
}(()=>error("Something failed")), function(cb) {
    cb();
}(()=>{
    throw Error();
}), function(cb) {
    cb();
}(()=>error("Error callback"));

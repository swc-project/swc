function error(message) {
    throw new Error(message);
}
(function(cb) {
    cb();
})(()=>"hello"
), function(cb) {
    cb();
}(()=>error("Something failed")
), function(cb) {
    cb();
}(()=>{
    throw new Error();
}), function(cb) {
    cb();
}(()=>error("Error callback")
);

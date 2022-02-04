function error(message) {
    throw new Error(message);
}
function test(cb) {
    return cb();
}
test(()=>"hello"
), test(()=>error("Something failed")
), test(()=>{
    throw new Error();
}), test(()=>error("Error callback")
);

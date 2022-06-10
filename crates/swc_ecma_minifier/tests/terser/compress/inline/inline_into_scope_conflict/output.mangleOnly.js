var a = pass;
const b = function b() {
    a();
};
const c = function a() {
    for(;;){
        b();
        break;
    }
};
(function() {
    var a = id(a);
    c();
})();

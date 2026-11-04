function foo() {
    var _newtarget = new.target;
    const a = function(a) {
        return _newtarget;
    };
}

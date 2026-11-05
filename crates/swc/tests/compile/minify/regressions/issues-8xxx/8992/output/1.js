var myObj = {
    get foo () {
        var _this = this;
        return function() {
            return _this;
        };
    }
};
var fn = myObj.foo;
console.log(fn() === myObj);

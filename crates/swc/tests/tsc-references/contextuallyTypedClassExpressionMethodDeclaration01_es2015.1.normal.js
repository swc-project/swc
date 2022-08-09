// @noImplicitAny: true
function getFoo1() {
    return class {
        static method1(arg) {
            arg.numProp = 10;
        }
        static method2(arg) {
            arg.strProp = "hello";
        }
    };
}
function getFoo2() {
    var _class;
    return _class = class {
    }, _class.method1 = (arg)=>{
        arg.numProp = 10;
    }, _class.method2 = (arg)=>{
        arg.strProp = "hello";
    }, _class;
}
function getFoo3() {
    var _class;
    return _class = class {
    }, _class.method1 = function(arg) {
        arg.numProp = 10;
    }, _class.method2 = function(arg) {
        arg.strProp = "hello";
    }, _class;
}

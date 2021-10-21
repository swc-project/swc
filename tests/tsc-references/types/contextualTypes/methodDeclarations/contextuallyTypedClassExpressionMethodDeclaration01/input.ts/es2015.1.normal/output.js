var _class, _class1;
function getFoo1() {
    return class _class {
        static method1(arg) {
            arg.numProp = 10;
        }
        static method2(arg1) {
            arg1.strProp = "hello";
        }
    };
}
function getFoo2() {
    return _class = class {
    }, _class.method1 = (arg)=>{
        arg.numProp = 10;
    }, _class.method2 = (arg)=>{
        arg.strProp = "hello";
    }, _class;
}
function getFoo3() {
    return _class1 = class {
    }, _class1.method1 = function(arg) {
        arg.numProp = 10;
    }, _class1.method2 = function(arg) {
        arg.strProp = "hello";
    }, _class1;
}

// @noImplicitAny: true
function getFoo1() {
    return class {
        method1(arg) {
            arg.numProp = 10;
        }
        method2(arg) {
            arg.strProp = "hello";
        }
    };
}
function getFoo2() {
    return class {
        constructor(){
            this.method1 = (arg)=>{
                arg.numProp = 10;
            };
            this.method2 = (arg)=>{
                arg.strProp = "hello";
            };
        }
    };
}
function getFoo3() {
    return class {
        constructor(){
            this.method1 = function(arg) {
                arg.numProp = 10;
            };
            this.method2 = function(arg) {
                arg.strProp = "hello";
            };
        }
    };
}

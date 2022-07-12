// @noImplicitAny: true
function getFoo1() {
    return {
        method1: function method1(arg) {
            arg.numProp = 10;
        },
        method2: function method2(arg) {
            arg.strProp = "hello";
        }
    };
}
function getFoo2() {
    return {
        method1: function(arg) {
            arg.numProp = 10;
        },
        method2: function(arg) {
            arg.strProp = "hello";
        }
    };
}
function getFoo3() {
    return {
        method1: function method1(arg) {
            arg.numProp = 10;
        },
        method2: function method2(arg) {
            arg.strProp = "hello";
        }
    };
}

//// [assignmentCompatWithCallSignaturesWithRestParameters.ts]
// call signatures in derived types must have the same or fewer optional parameters as the target for assignment
var a; // ok, same number of required params
a = function a() {
    return 1;
}; // ok, same number of required params
a = function a() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return 1;
}; // ok, same number of required params
a = function a() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return 1;
}; // error, type mismatch
a = function a(x) {
    return 1;
}; // ok, same number of required params
a = function a(x, y, z) {
    return 1;
}; // ok, same number of required params
a = function a(x) {
    return 1;
}; // ok, rest param corresponds to infinite number of params
a = function a(x) {
    return 1;
}; // error, incompatible type
var a2;
a2 = function a2() {
    return 1;
}; // ok, fewer required params
a2 = function a2() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return 1;
}; // ok, fewer required params
a2 = function a2(x) {
    return 1;
}; // ok, fewer required params
a2 = function a2(x) {
    return 1;
}; // ok, same number of required params
a2 = function a2(x) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    return 1;
}; // ok, same number of required params
a2 = function a2(x) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    return 1;
}; // should be type mismatch error
a2 = function a2(x, y) {
    return 1;
}; // ok, rest param corresponds to infinite number of params
a2 = function a2(x, y) {
    return 1;
}; // ok, same number of required params
var a3;
a3 = function a3() {
    return 1;
}; // ok, fewer required params
a3 = function a3(x) {
    return 1;
}; // ok, fewer required params
a3 = function a3(x) {
    return 1;
}; // ok, same number of required params
a3 = function a3(x, y) {
    return 1;
}; // ok, all present params match
a3 = function a3(x, y, z) {
    return 1;
}; // error
a3 = function a3(x) {
    for(var _len = arguments.length, z = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        z[_key - 1] = arguments[_key];
    }
    return 1;
}; // error
a3 = function a3(x, y, z) {
    return 1;
}; // error
var a4;
a4 = function a4() {
    return 1;
}; // ok, fewer required params
a4 = function a4(x, y) {
    return 1;
}; // error, type mismatch
a4 = function a4(x) {
    return 1;
}; // ok, all present params match
a4 = function a4(x, y) {
    return 1;
}; // error, second param has type mismatch
a4 = function a4(x, y) {
    return 1;
}; // ok, same number of required params with matching types
a4 = function a4(x) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    return 1;
}; // error, rest params have type mismatch

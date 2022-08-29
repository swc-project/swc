//// [assignmentCompatWithCallSignaturesWithOptionalParameters.ts]
// call signatures in derived types must have the same or fewer optional parameters as the base type
var b;
var a;
a = function() {
    return 1 // ok, same number of required params
    ;
};
a = function(x) {
    return 1;
}; // ok, same number of required params
a = function(x) {
    return 1;
}; // error, too many required params
a = b.a; // ok
a = b.a2; // ok
a = b.a3; // error
a = b.a4; // error
a = b.a5; // ok
a = b.a6; // error
var a2;
a2 = function() {
    return 1;
}; // ok, same number of required params
a2 = function(x) {
    return 1;
}; // ok, same number of required params
a2 = function(x) {
    return 1;
}; // ok, same number of params
a2 = b.a; // ok
a2 = b.a2; // ok
a2 = b.a3; // ok, same number of params
a2 = b.a4; // ok, excess params are optional in b.a3
a2 = b.a5; // ok
a2 = b.a6; // error
var a3;
a3 = function() {
    return 1;
}; // ok, fewer required params
a3 = function(x) {
    return 1;
}; // ok, fewer required params
a3 = function(x) {
    return 1;
}; // ok, same number of required params
a3 = function(x, y) {
    return 1;
}; // error, too many required params
a3 = b.a; // ok
a3 = b.a2; // ok
a3 = b.a3; // ok
a3 = b.a4; // ok
a3 = b.a5; // ok
a3 = b.a6; // error
var a4;
a4 = function() {
    return 1;
}; // ok, fewer required params
a4 = function(x, y) {
    return 1;
}; // ok, fewer required params
a4 = function(x) {
    return 1;
}; // ok, same number of required params
a4 = function(x, y) {
    return 1;
}; // ok, same number of params
a4 = b.a; // ok
a4 = b.a2; // ok
a4 = b.a3; // ok
a4 = b.a4; // ok
a4 = b.a5; // ok
a4 = b.a6; // ok, same number of params
var a5;
a5 = function() {
    return 1;
}; // ok, fewer required params
a5 = function(x, y) {
    return 1;
}; // ok, fewer required params
a5 = function(x) {
    return 1;
}; // ok, fewer params in lambda
a5 = function(x, y) {
    return 1;
}; // ok, same number of params
a5 = b.a; // ok
a5 = b.a2; // ok
a5 = b.a3; // ok, fewer params in b.a3
a5 = b.a4; // ok, same number of params
a5 = b.a5; // ok
a5 = b.a6; // ok, same number of params

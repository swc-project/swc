// Generic call with parameter of object type with member of function type of n args passed object whose associated member is call signature with n+1 args
function foo(arg) {
    return arg.cb(null);
}
var arg = {
    cb: (x)=>''
};
var r = foo(arg); // {}
// more args not allowed
var r2 = foo({
    cb: (x, y)=>''
}); // error
var r3 = foo({
    cb: (x, y)=>''
}); // error
function foo2(arg) {
    return arg.cb(null, null);
}
// fewer args ok
var r4 = foo(arg); // {}
var r5 = foo({
    cb: (x)=>''
}); // {}
var r6 = foo({
    cb: (x)=>''
}); // string
var r7 = foo({
    cb: ()=>''
}); // string

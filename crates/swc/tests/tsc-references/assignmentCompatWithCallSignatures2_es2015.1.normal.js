var t;
var a;
t = a;
a = t;
var s;
var a2;
t = s;
t = a2;
a = s;
a = a2;
t = {
    f: ()=>1
};
t = {
    f: (x)=>1
};
t = {
    f: function f() {
        return 1;
    }
};
t = {
    f (x) {
        return '';
    }
};
a = {
    f: ()=>1
};
a = {
    f: (x)=>1
};
a = {
    f: function(x) {
        return '';
    }
};
// errors
t = ()=>1;
t = function(x) {
    return '';
};
a = ()=>1;
a = function(x) {
    return '';
};
var s2;
var a3;
// these are errors
t = s2;
t = a3;
t = (x)=>1;
t = function(x) {
    return '';
};
a = s2;
a = a3;
a = (x)=>1;
a = function(x) {
    return '';
};

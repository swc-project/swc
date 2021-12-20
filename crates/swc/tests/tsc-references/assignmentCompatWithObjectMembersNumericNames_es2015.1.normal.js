// members N and M of types S and T have the same name, same accessibility, same optionality, and N is assignable M
// numeric named properties work correctly, no errors expected
class S {
}
class T {
}
var s;
var t;
var s2;
var t2;
var a;
var b;
var a2 = {
    1: ''
};
var b2 = {
    1: ''
};
s = t;
t = s;
s = s2;
s = a2;
s2 = t2;
t2 = s2;
s2 = t;
s2 = b;
s2 = a2;
a = b;
b = a;
a = s;
a = s2;
a = a2;
a2 = b2;
b2 = a2;
a2 = b;
a2 = t2;
a2 = t;

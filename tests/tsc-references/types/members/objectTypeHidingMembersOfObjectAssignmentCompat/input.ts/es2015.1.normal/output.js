var i;
var o;
o = i; // error
i = o; // ok
class C {
    toString() {
    }
}
var c;
o = c; // error
c = o; // ok
var a = {
    toString: ()=>{
    }
};
o = a; // error
a = o; // ok

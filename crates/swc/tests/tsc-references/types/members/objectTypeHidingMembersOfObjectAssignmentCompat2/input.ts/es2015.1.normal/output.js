var i;
var o;
o = i; // error
i = o; // error
class C {
    toString() {
        return 1;
    }
}
var c;
o = c; // error
c = o; // error
var a = {
    toString: ()=>{
    }
};
o = a; // error
a = o; // ok

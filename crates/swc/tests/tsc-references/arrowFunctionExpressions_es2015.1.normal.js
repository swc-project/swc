// ArrowFormalParameters => AssignmentExpression is equivalent to ArrowFormalParameters => { return AssignmentExpression; }
var a = (p)=>p.length;
var a = (p)=>{
    return p.length;
};
// Identifier => Block is equivalent to(Identifier) => Block
var b = (j)=>{
    return 0;
};
var b = (j)=>{
    return 0;
};
// Identifier => AssignmentExpression is equivalent to(Identifier) => AssignmentExpression
var c;
var d = (n)=>c = n;
var d = (n)=>c = n;
var d;
// Binding patterns in arrow functions
var p1 = ([a])=>{};
var p2 = ([...a])=>{};
var p3 = ([, a])=>{};
var p4 = ([, ...a])=>{};
var p5 = ([a = 1])=>{};
var p6 = ({ a  })=>{};
var p7 = ({ a: { b  }  })=>{};
var p8 = ({ a =1  })=>{};
var p9 = ({ a: { b =1  } = {
    b: 1
}  })=>{};
var p10 = ([{ value , done  }])=>{};
// Arrow function used in class member initializer
// Arrow function used in class member function
class MyClass {
    fn() {
        var m = (n)=>n + 1;
        var p = (n)=>n && this;
    }
    constructor(){
        this.m = (n)=>n + 1;
        this.p = (n)=>n && this;
    }
}
// Arrow function used in arrow function
var arrrr = ()=>(m)=>()=>(n)=>m + n;
var e = arrrr()(3)()(4);
var e;
// Arrow function used in arrow function used in function
function someFn() {
    var arr = (n)=>(p)=>p * n;
    arr(3)(4).toExponential();
}
// Arrow function used in function
function someOtherFn() {
    var arr = (n)=>'' + n;
    arr(4).charAt(0);
}
// Arrow function used in nested function in function
function outerFn() {
    function innerFn() {
        var arrowFn = ()=>{};
        var p = arrowFn();
        var p;
    }
}
// Arrow function used in nested function in arrow function
var f = (n)=>{
    function fn(x) {
        return ()=>n + x;
    }
    return fn(4);
};
var g = f('')();
var g;
// Arrow function used in nested function in arrow function in nested function
function someOuterFn() {
    var arr = (n)=>{
        function innerFn() {
            return ()=>n.length;
        }
        return innerFn;
    };
    return arr;
}
var h = someOuterFn()('')()();
h.toExponential();
// Arrow function used in try/catch/finally in function
function tryCatchFn() {
    try {
        var x = ()=>this;
    } catch (e1) {
        var t = ()=>e1 + this;
    } finally{
        var m = ()=>this + '';
    }
}

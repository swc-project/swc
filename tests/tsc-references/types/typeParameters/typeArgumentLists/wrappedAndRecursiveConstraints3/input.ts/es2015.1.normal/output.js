// no errors expected
class C {
    foo(x1) {
        function bar(x) {
            return x;
        }
        return bar;
    }
    constructor(x){
    }
}
var c = new C({
    length: 2
});
var r = c.foo({
    length: 3,
    charAt: (x)=>{
        '';
    }
});
var r2 = r('');

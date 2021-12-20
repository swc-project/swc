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
var r = c.foo('');
var r2 = r({
    length: 3,
    charAt: (x)=>{
        '';
    }
}); // error

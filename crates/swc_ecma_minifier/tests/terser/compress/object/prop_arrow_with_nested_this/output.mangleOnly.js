function a(a) {
    console.log(a === this ? "global" : a === b ? "foo" : a);
}
var b = {
    func_func_this: function() {
        (function() {
            a(this);
        })();
    },
    func_arrow_this: function() {
        (()=>{
            a(this);
        })();
    },
    arrow_func_this: ()=>{
        (function() {
            a(this);
        })();
    },
    arrow_arrow_this: ()=>{
        (()=>{
            a(this);
        })();
    }
};
for(var c in b)b[c]();

function c(b) {
    console.log(b === this ? "global" : b === a ? "foo" : b);
}
var a = {
    func_func_this: function() {
        (function() {
            c(this);
        })();
    },
    func_arrow_this: function() {
        (()=>{
            c(this);
        })();
    },
    arrow_func_this: ()=>{
        (function() {
            c(this);
        })();
    },
    arrow_arrow_this: ()=>{
        (()=>{
            c(this);
        })();
    }
};
for(var b in a)a[b]();

function i(i) {
    console.log(i === this ? "global" : i === n ? "foo" : i);
}
var n = {
    func_func_this: function() {
        (function() {
            i(this);
        })();
    },
    func_arrow_this: function() {
        (()=>{
            i(this);
        })();
    },
    arrow_func_this: ()=>{
        (function() {
            i(this);
        })();
    },
    arrow_arrow_this: ()=>{
        (()=>{
            i(this);
        })();
    }
};
for(var t in n)n[t]();

function i(i) {
    console.log(i === this ? "global" : i === o ? "foo" : i);
}
var o = {
    func_no_this: function() {
        i();
    },
    func_with_this: function() {
        i(this);
    },
    arrow_no_this: ()=>{
        i();
    },
    arrow_with_this: ()=>{
        i(this);
    }
};
for(var t in o)o[t]();

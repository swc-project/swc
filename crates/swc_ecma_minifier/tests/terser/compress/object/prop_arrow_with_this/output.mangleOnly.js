function c(b) {
    console.log(b === this ? "global" : b === a ? "foo" : b);
}
var a = {
    func_no_this: function() {
        c();
    },
    func_with_this: function() {
        c(this);
    },
    arrow_no_this: ()=>{
        c();
    },
    arrow_with_this: ()=>{
        c(this);
    }
};
for(var b in a)a[b]();

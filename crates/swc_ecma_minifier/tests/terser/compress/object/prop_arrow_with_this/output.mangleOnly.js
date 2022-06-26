function a(a) {
    console.log(a === this ? "global" : a === b ? "foo" : a);
}
var b = {
    func_no_this: function() {
        a();
    },
    func_with_this: function() {
        a(this);
    },
    arrow_no_this: ()=>{
        a();
    },
    arrow_with_this: ()=>{
        a(this);
    }
};
for(var c in b)b[c]();

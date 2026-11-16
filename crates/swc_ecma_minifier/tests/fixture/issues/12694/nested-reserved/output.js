var vs = [];
function f() {
    !function() {
        try {
            var x = 1;
        } catch (c) {}
        vs.push(()=>x);
    }(), function() {
        try {
            var x = 2;
        } catch (c) {}
        vs.push(()=>x);
    }();
}
f(), console.log(vs.map((c)=>c()).join());

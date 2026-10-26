globalThis.View = class {
}, function() {
    let l, e;
    var n = l || (l = {});
    let a = class Handle extends globalThis.View {
        static self() {
            return a;
        }
    };
    n.Handle = a;
    var s = e || (e = {});
    let o = class Handle extends globalThis.View {
        static self() {
            return o;
        }
    };
    s.Handle = o, console.log(l.Handle.name, e.Handle.name), console.log(l.Handle !== e.Handle), console.log(l.Handle.self() === l.Handle), console.log(e.Handle.self() === e.Handle), console.log(new l.Handle() instanceof globalThis.View), console.log(new e.Handle() instanceof globalThis.View);
}();

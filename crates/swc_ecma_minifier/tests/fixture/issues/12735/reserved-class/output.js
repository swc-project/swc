(()=>{
    let e = {}, l = {};
    ((e)=>{
        e.sample = "one";
        class Handle {
            static check(l) {
                return l === e.sample;
            }
        }
        e.Handle = Handle, e.Other = Handle;
    })(e), ((e)=>{
        e.sample = "two";
        class Handle {
            static check(l) {
                return l === e.sample;
            }
        }
        e.Handle = Handle, e.Other = Handle;
    })(l), console.log(e.Handle.check("one"), l.Handle.check("two"), e.Handle !== l.Handle, e.Other === e.Handle);
})();

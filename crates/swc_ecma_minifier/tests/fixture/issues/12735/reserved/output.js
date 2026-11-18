(()=>{
    let e = {}, s = {};
    ((e)=>{
        function is(s) {
            return s === e.sample;
        }
        e.sample = "one", e.is = is, e.check = is;
    })(e), ((e)=>{
        function is(s) {
            return s === e.sample;
        }
        e.sample = "two", e.is = is, e.check = is;
    })(s), console.log(e.is("one"), s.is("two"), e.check("one"), s.check("two"));
})();

(()=>{
    let s = {}, e = {};
    ((s)=>{
        function is(e) {
            return e === s.sample;
        }
        s.sample = "one", s.is = is;
    })(s), ((s)=>{
        function is(e) {
            return e === s.sample;
        }
        s.sample = "two", s.is = is;
    })(e), console.log(s.is("one"), e.is("two"), s.is.name, e.is.name);
})();

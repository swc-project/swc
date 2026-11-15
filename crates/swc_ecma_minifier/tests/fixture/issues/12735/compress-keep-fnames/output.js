(()=>{
    let first = {}, second = {};
    ((ns)=>{
        function is(value) {
            return value === ns.sample;
        }
        ns.sample = "one", ns.is = is;
    })(first), ((ns)=>{
        function is(value) {
            return value === ns.sample;
        }
        ns.sample = "two", ns.is = is;
    })(second), console.log(first.is("one"), second.is("two"), first.is.name, second.is.name);
})();

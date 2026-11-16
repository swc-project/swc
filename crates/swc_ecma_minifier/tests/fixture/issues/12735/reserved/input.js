(() => {
    const first = {}, second = {};

    (ns => {
        ns.sample = "one";
        function is(value) { return value === ns.sample; }
        ns.is = is;
        ns.check = is;
    })(first);

    (ns => {
        ns.sample = "two";
        function is(value) { return value === ns.sample; }
        ns.is = is;
        ns.check = is;
    })(second);

    console.log(first.is("one"), second.is("two"), first.check("one"), second.check("two"));
})();

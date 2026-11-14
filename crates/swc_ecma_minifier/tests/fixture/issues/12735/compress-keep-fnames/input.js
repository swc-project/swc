(() => {
    const first = {}, second = {};

    (ns => {
        ns.sample = "one";
        function is(value) { return value === ns.sample; }
        ns.is = is;
    })(first);

    (ns => {
        ns.sample = "two";
        function is(value) { return value === ns.sample; }
        ns.is = is;
    })(second);

    console.log(first.is("one"), second.is("two"), first.is.name, second.is.name);
})();

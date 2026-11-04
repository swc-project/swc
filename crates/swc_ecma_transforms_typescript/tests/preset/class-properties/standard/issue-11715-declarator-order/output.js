const first = 1, second = (()=>{
    let Nested = /*#__PURE__*/ function(Nested) {
        Nested[Nested["A"] = 1] = "A";
        Nested[Nested["B"] = 2] = "B";
        return Nested;
    }({});
    return Nested;
})();

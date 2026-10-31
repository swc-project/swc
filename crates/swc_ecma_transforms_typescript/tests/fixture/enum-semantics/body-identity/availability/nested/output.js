var Outer = function(Outer) {
    Outer[Outer["First"] = (()=>{
        let Local = /*#__PURE__*/ function(Local) {
            Local["A"] = "local";
            Local["B"] = "local";
            return Local;
        }({});
        const text = "text";
        let Derived = /*#__PURE__*/ function(Derived) {
            Derived["A"] = "text";
            return Derived;
        }({});
        return "local" + "text";
    })()] = "First";
    Outer["Next"] = "next";
    Outer[Outer["Prior"] = "next"] = "Prior";
    Outer[Outer["Shorthand"] = (()=>({
            Next: "next"
        }))().Next] = "Shorthand";
    Outer[Outer["Forward"] = Outer.Last] = "Forward";
    Outer["Last"] = "last";
    return Outer;
}(Outer || {});
function nested() {
    let E = function(E) {
        E[E["A"] = (()=>{
            let Local = /*#__PURE__*/ function(Local) {
                Local["A"] = "a";
                Local["B"] = "a";
                return Local;
            }({});
            return "a";
        })()] = "A";
        E["B"] = "b";
        E[E["C"] = (()=>"b")()] = "C";
        return E;
    }({});
    return E;
}

(function(Values) {
    Values.value = 3;
    function fromParameter(value) {
        let E = function(E) {
            E[E["A"] = value] = "A";
            return E;
        }({});
        return E.A;
    }
    Values.fromParameter = fromParameter;
    Values.fromArrow = (value)=>{
        let E = function(E) {
            E[E["A"] = value] = "A";
            return E;
        }({});
        return E.A;
    };
    function fromCatch() {
        try {
            throw 19;
        } catch (value) {
            let E = function(E) {
                E[E["A"] = value] = "A";
                return E;
            }({});
            return E.A;
        }
    }
    Values.fromCatch = fromCatch;
})(Values || (Values = {}));
const result = [
    Values.fromParameter(7),
    Values.fromArrow(13),
    Values.fromCatch()
];
var Values;

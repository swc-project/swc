function asArrow() {
    (()=>{
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 1] = "A";
            return E;
        }({});
        return 1;
    })();
    const later = 1;
}
function asFunction() {
    (function() {
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 1] = "A";
            return E;
        }({});
        return 1;
    })();
    const later = 1;
}
function satisfiesArrow() {
    (()=>{
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 1] = "A";
            return E;
        }({});
        return 1;
    })();
    const later = 1;
}
function nonNullFunction() {
    (function() {
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 1] = "A";
            return E;
        }({});
        return 1;
    })();
    const later = 1;
}
function assertionArrow() {
    (()=>{
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 1] = "A";
            return E;
        }({});
        return 1;
    })();
    const later = 1;
}
function instantiationFunction() {
    (function() {
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 1] = "A";
            return E;
        }({});
        return 1;
    })();
    const later = 1;
}
function parenthesizedArrow() {
    (()=>{
        let E = function(E) {
            E[E["A"] = later] = "A";
            return E;
        }({});
        return E.A;
    })();
    const later = 1;
}
function parenthesizedFunction() {
    (function() {
        let E = function(E) {
            E[E["A"] = later] = "A";
            return E;
        }({});
        return E.A;
    })();
    const later = 1;
}
function wrappedLocalArrow() {
    (()=>{
        let E = function(E) {
            E[E["A"] = later] = "A";
            return E;
        }({});
        const later = 1;
        return E.A;
    })();
}

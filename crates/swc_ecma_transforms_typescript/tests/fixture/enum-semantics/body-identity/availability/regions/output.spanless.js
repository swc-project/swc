function deferred() {
    let E = /*#__PURE__*/ function(E) {
        E["A"] = "outer";
        return E;
    }({});
    return E;
}
const arrow = ()=>{
    let E = /*#__PURE__*/ function(E) {
        E["A"] = "outer";
        return E;
    }({});
    return E;
};
class C {
    field = (()=>{
        let E = /*#__PURE__*/ function(E) {
            E["A"] = "outer";
            return E;
        }({});
        return E;
    })();
    constructor(){
        let E = /*#__PURE__*/ function(E) {
            E["A"] = "outer";
            return E;
        }({});
        this.ctor = E;
    }
    method() {
        let E = /*#__PURE__*/ function(E) {
            E["A"] = "outer";
            return E;
        }({});
        return E;
    }
}
function staticField() {
    class S {
        static field = (()=>{
            let E = function(E) {
                E[E["A"] = local] = "A";
                return E;
            }({});
            return E;
        })();
    }
    const local = "local";
    return S;
}
function cachedBefore() {
    function prime() {
        let E = /*#__PURE__*/ function(E) {
            E["A"] = "local";
            return E;
        }({});
        return E;
    }
    let Before = function(Before) {
        Before[Before["A"] = local] = "A";
        return Before;
    }({});
    const local = "local";
    return [
        prime(),
        Before
    ];
}
const outer = "outer";
function enumDeferred() {
    let E = /*#__PURE__*/ function(E) {
        E["A"] = "later";
        return E;
    }({});
    return E;
}
function enumCachedBefore() {
    function prime() {
        let E = /*#__PURE__*/ function(E) {
            E["A"] = "local";
            return E;
        }({});
        return E;
    }
    let Before = function(Before) {
        Before[Before["A"] = Local.A] = "A";
        return Before;
    }({});
    let Local = /*#__PURE__*/ function(Local) {
        Local["A"] = "local";
        return Local;
    }({});
    return [
        prime(),
        Before
    ];
}
var Later = /*#__PURE__*/ function(Later) {
    Later["A"] = "later";
    return Later;
}(Later || {});

function deferred() {
    const value = outer;
    let E = /*#__PURE__*/ function(E) {
        E[E["A"] = 42] = "A";
        E[E["B"] = 43] = "B";
        return E;
    }({});
    return 43;
}
class Instance {
    constructor(){
        this.value = (()=>{
            let E = /*#__PURE__*/ function(E) {
                E[E["A"] = 42] = "A";
                E[E["B"] = 43] = "B";
                return E;
            }({});
            return 43;
        })();
    }
}
class Methods {
    [(()=>{
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 42] = "A";
            E[E["B"] = 43] = "B";
            return E;
        }({});
        return 43;
    })()]() {
        return 1;
    }
    get [(()=>{
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 42] = "A";
            return E;
        }({});
        return 42;
    })()]() {
        return 2;
    }
}
const methods = {
    [(()=>{
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 42] = "A";
            E[E["B"] = 43] = "B";
            return E;
        }({});
        return 43;
    })()] () {
        return 3;
    },
    get [(()=>{
        let E = /*#__PURE__*/ function(E) {
            E[E["A"] = 42] = "A";
            return E;
        }({});
        return 42;
    })()] () {
        return 4;
    }
};
const outer = 42;
let immediateFailed = false;
try {
    (()=>{
        let E = function(E) {
            E[E["A"] = later] = "A";
            E[E["B"] = void 0] = "B";
            return E;
        }({});
        return E.B;
    })();
} catch  {
    immediateFailed = true;
}
const later = 7;

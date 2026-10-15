function factory(value) {
    return ()=>{};
}
function method() {
    class C {
        run() {}
    }
    _ts_decorate([
        factory((()=>{
            let E = function(E) {
                E[E["A"] = later] = "A";
                return E;
            }({});
            return E.A;
        })())
    ], C.prototype, "run", null);
    const later = 1;
    return C;
}
function parameter() {
    class C {
        run(value) {}
    }
    _ts_decorate([
        _ts_param(0, factory((()=>{
            let E = function(E) {
                E[E["A"] = later] = "A";
                return E;
            }({});
            return E.A;
        })()))
    ], C.prototype, "run", null);
    const later = 1;
    return C;
}
function constructorParameter() {
    class C {
        constructor(value){}
    }
    C = _ts_decorate([
        _ts_param(0, factory((()=>{
            let E = function(E) {
                E[E["A"] = later] = "A";
                return E;
            }({});
            return E.A;
        })()))
    ], C);
    const later = 1;
    return C;
}
function parameterProperty() {
    class C {
        value;
        constructor(value){
            this.value = value;
        }
    }
    C = _ts_decorate([
        _ts_param(0, factory((()=>{
            let E = function(E) {
                E[E["A"] = later] = "A";
                return E;
            }({});
            return E.A;
        })()))
    ], C);
    const later = 1;
    return C;
}
function enumMember() {
    class C {
        run() {}
    }
    _ts_decorate([
        factory((()=>{
            let E = function(E) {
                E[E["A"] = Later.A] = "A";
                return E;
            }({});
            return E.A;
        })())
    ], C.prototype, "run", null);
    let Later = /*#__PURE__*/ function(Later) {
        Later[Later["A"] = 1] = "A";
        return Later;
    }({});
    return C;
}
function initialized() {
    const earlier = 1;
    class C {
        value;
        run(value = (()=>{
            let E = /*#__PURE__*/ function(E) {
                E[E["A"] = 2] = "A";
                return E;
            }({});
            return 2;
        })()) {
            let E = /*#__PURE__*/ function(E) {
                E[E["A"] = 2] = "A";
                return E;
            }({});
            return [
                value,
                2
            ];
        }
        constructor(value = (()=>{
            let E = /*#__PURE__*/ function(E) {
                E[E["A"] = 2] = "A";
                return E;
            }({});
            return 2;
        })()){
            this.value = value;
        }
    }
    _ts_decorate([
        factory((()=>{
            let E = /*#__PURE__*/ function(E) {
                E[E["A"] = 1] = "A";
                return E;
            }({});
            return 1;
        })())
    ], C.prototype, "run", null);
    const later = 2;
    const instance = new C();
    return [
        instance.value,
        ...instance.run()
    ];
}

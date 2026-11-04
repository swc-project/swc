const visits = [];
var Outer = function(Outer) {
    Outer[Outer["First"] = (()=>{
        let Local = /*#__PURE__*/ function(Local) {
            Local[Local["Value"] = 3] = "Value";
            Local[Local["Next"] = 4] = "Next";
            return Local;
        }({});
        visits.push(4);
        return 4;
    })()] = "First";
    Outer[Outer["Second"] = (()=>{
        let Local = /*#__PURE__*/ function(Local) {
            Local[Local["Value"] = 7] = "Value";
            return Local;
        }({});
        (function(Local) {
            Local.extra = 2;
        })(Local || (Local = {}));
        visits.push(7);
        return 7 + Local.extra;
    })()] = "Second";
    Outer[Outer["After"] = Outer.Second + 1] = "After";
    return Outer;
}(Outer || {});
(function(Container) {
    (function(Outer) {
        Outer[Outer["First"] = (()=>{
            let Inner = /*#__PURE__*/ function(Inner) {
                Inner[Inner["Value"] = 11] = "Value";
                return Inner;
            }({});
            visits.push(11);
            return 11;
        })()] = "First";
        Outer[Outer["Second"] = Outer.First + 1] = "Second";
    })(Container.Outer || (Container.Outer = {}));
    Container.result = Container.Outer.Second;
})(Container || (Container = {}));
const result = [
    Outer.First,
    Outer.Second,
    Outer.After,
    Container.Outer.First,
    Container.result,
    ...visits
];
var Container;

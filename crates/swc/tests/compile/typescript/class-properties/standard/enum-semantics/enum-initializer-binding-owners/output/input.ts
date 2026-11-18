const source = 17;
var Root = /*#__PURE__*/ function(Root) {
    Root[Root["A"] = 17] = "A";
    return Root;
}(Root || {});
function parameter(source) {
    let Local = function(Local) {
        Local[Local["A"] = source] = "A";
        Local[Local["B"] = Local.A + 1] = "B";
        return Local;
    }({});
    return Local;
}
const arrow = (source)=>{
    let Local = function(Local) {
        Local[Local["A"] = source] = "A";
        return Local;
    }({});
    return Local;
};
function caught() {
    try {
        throw 31;
    } catch (source) {
        let Local = function(Local) {
            Local[Local["A"] = source] = "A";
            return Local;
        }({});
        return Local;
    }
}
export const result = [
    17,
    parameter(23),
    arrow(29),
    caught()
];

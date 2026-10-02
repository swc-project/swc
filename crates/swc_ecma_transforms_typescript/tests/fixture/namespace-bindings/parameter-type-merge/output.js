// The parameter contributes a value even when a type shares its resolved ID.
function read(Value) {
    (function(Local) {
        Local.Alias = Value;
        Local.result = Local.Alias;
    })(Local || (Local = {}));
    return Local.result;
    var Local;
}
console.log(read(7));

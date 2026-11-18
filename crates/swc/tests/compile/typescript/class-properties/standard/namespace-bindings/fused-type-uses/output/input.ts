(function(Models) {
    class Value {
        constructor(){
            this.value = 1;
        }
    }
    Models.Value = Value;
})(Models || (Models = {}));
const Live = Models.Value;
function scoped(Value) {
    return Value;
}
export const result = new Live().value + scoped(4);
var Models;

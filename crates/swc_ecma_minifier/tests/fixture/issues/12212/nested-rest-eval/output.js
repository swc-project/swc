function nested(...rest) {
    return function() {
        return eval("rest.length");
    }();
}
function constructor(...rest) {
    new class {
        constructor(){
            console.log(eval("rest.length"));
        }
    };
}
console.log(nested(1));
constructor(1);

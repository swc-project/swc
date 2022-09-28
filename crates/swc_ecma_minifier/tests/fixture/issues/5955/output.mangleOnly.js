export var foo;
export function init() {
    function o() {
        foo = o;
        console.log(111);
    }
    return o;
}
function o() {
    foo = o;
    console.log(111);
}
export function init1() {
    return o;
}

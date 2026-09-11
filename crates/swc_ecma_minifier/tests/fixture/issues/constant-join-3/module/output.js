import.meta.toString = ()=>"s";
import.meta.valueOf = ()=>1;
console.log([
    import.meta
].join(""));
async function dynamic_import_order() {
    let hit = false;
    try {
        [
            await import("data:text/javascript,export default 1"),
            hit = true
        ].join("");
    } catch  {}
    console.log(hit);
}
function direct_dynamic_import_object_coercion_order() {
    let value;
    try {
        [
            value = import("data:text/javascript,export default 1"),
            value.toString = 0
        ].join("");
    } catch  {
        console.log(true);
    }
}
dynamic_import_order();
direct_dynamic_import_object_coercion_order();

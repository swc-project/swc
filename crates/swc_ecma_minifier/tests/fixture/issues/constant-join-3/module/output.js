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
dynamic_import_order();

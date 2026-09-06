async function nestedArrowBinding() {
    return function(value1 = (await)=>0) {};
}
class StaticInitializers {
    static field = function(await) {
        return await;
    };
    static #private = function(await) {
        return await;
    };
    static accessor value = function(await) {
        return await;
    };
}
"23";
`${23..toString()}` !== value;

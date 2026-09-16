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
async function asyncInstanceInitializers() {
    return class {
        field = (await)=>await;
        #private = (await)=>await;
        accessor value = (await)=>await;
    };
}
class StaticInstanceInitializers {
    static value = class {
        field = (await)=>await;
        #private = (await)=>await;
        accessor value = (await)=>await;
    };
}
"23";
`${23..toString()}` !== value;
void 0 !== value;

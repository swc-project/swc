async function nestedArrowBinding() {
    return function (value = (await) => 0) {};
}

class StaticInitializers {
    static field = function (await) {
        return await;
    };
    static #private = function (await) {
        return await;
    };
    static accessor value = function (await) {
        return await;
    };
}

async function asyncInstanceInitializers() {
    return class {
        field = function (await) {
            return await;
        };
        #private = function (await) {
            return await;
        };
        accessor value = function (await) {
            return await;
        };
    };
}

class StaticInstanceInitializers {
    static value = class {
        field = function (await) {
            return await;
        };
        #private = function (await) {
            return await;
        };
        accessor value = function (await) {
            return await;
        };
    };
}

`${(23).toString()}` !== "23";
`${(23).toString()}` !== value;
void (23).toString() !== value;

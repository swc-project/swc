async function nestedArrowBody() {
    return function (value = () => {
        var await = 1;
        return await;
    }) {
        return value;
    };
}

class StaticComputedKey {
    static [function (await) {
        return await;
    }] = console.log(1);
}

console.log(typeof nestedArrowBody);
console.log(StaticComputedKey.name);

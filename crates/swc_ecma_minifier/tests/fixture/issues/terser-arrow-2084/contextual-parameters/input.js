function* generator() {
    return function (yield) {
        return ++yield;
    };
}

async function asynchronous() {
    return function (await) {
        return ++await;
    };
}

function* generatorDefault() {
    return function (value = yield) {
        return value;
    };
}

async function asynchronousDefault() {
    return function (value = await) {
        return value;
    };
}

const asyncArrow = async () => function (await) {
    return ++await;
};

console.log(generator().next().value(0));
asynchronous().then(function (fn) {
    console.log(fn(0));
});
asyncArrow().then(function (fn) {
    console.log(fn(0));
});
